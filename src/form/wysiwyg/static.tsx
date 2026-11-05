import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { styleMap, blockClassNames } from './const';

/**
 * Draft.js tartalom (raw JSON) megjelenítése draft-js NÉLKÜL.
 *
 * Ugyanazt a HTML-szerkezetet és osztályokat adja, mint a `<Wysiwyg disabled />`
 * (draft-js readOnly Editor), de:
 * - nincs benne hook/állapot → szerver komponensben is fut, a szöveg már a
 *   szerver által küldött HTML-ben ott van (LCP!);
 * - nem húzza be a draft-js + immutable csomagot (~70 KB) a böngészőbe.
 *
 * Csak megjelenítésre; szerkesztéshez a `editor.jsx` kell.
 */

type RawInlineStyleRange = { offset: number; length: number; style: string };
type RawEntityRange = { offset: number; length: number; key: number | string };

type RawBlock = {
  key: string;
  text: string;
  type: string;
  depth?: number;
  inlineStyleRanges?: RawInlineStyleRange[];
  entityRanges?: RawEntityRange[];
};

type RawEntity = {
  type: string;
  mutability?: string;
  data?: { url?: string; href?: string; target?: string; title?: string };
};

export type RawDraftContent = {
  blocks: RawBlock[];
  entityMap?: Record<string, RawEntity>;
};

export type StaticLinkProps = {
  url: string;
  target?: string;
  /** a link szövege (a draft-js decorator `decoratedText`-je) */
  text: string;
  children: ReactNode;
};

type PropTypes = {
  /** raw JSON string (ahogy a DB-ben van) vagy már parse-olt objektum */
  value?: string | RawDraftContent | null;
  /** LINK entitás megjelenítése (pl. Next Link belső linkhez) */
  linkComponent?: (props: StaticLinkProps) => ReactNode;
};

/** draft-js alap inline stílusai (DefaultDraftInlineStyle) + saját styleMap */
const INLINE_STYLES: Record<string, React.CSSProperties> = {
  BOLD: { fontWeight: 'bold' },
  CODE: { fontFamily: 'monospace', wordWrap: 'break-word' },
  ITALIC: { fontStyle: 'italic' },
  STRIKETHROUGH: { textDecoration: 'line-through' },
  UNDERLINE: { textDecoration: 'underline' },
  ...styleMap,
};

/** draft-js DefaultDraftBlockRenderMap */
const BLOCK_ELEMENTS: Record<string, string> = {
  'header-one': 'h1',
  'header-two': 'h2',
  'header-three': 'h3',
  'header-four': 'h4',
  'header-five': 'h5',
  'header-six': 'h6',
  'blockquote': 'blockquote',
  'code-block': 'pre',
  'atomic': 'figure',
  'unordered-list-item': 'li',
  'ordered-list-item': 'li',
};

const LIST_WRAPPERS: Record<string, { element: string; className: string; itemClassName: string }> = {
  'unordered-list-item': {
    element: 'ul',
    className: 'public-DraftStyleDefault-ul',
    itemClassName: 'public-DraftStyleDefault-unorderedListItem',
  },
  'ordered-list-item': {
    element: 'ol',
    className: 'public-DraftStyleDefault-ol',
    itemClassName: 'public-DraftStyleDefault-orderedListItem',
  },
};

const DefaultLink = ({ url, target, text, children }: StaticLinkProps) => (
  <a href={url} className="border-bottom" target={target} title={text}>
    {children}
  </a>
);

export const parseRawContent = (value: PropTypes['value']): RawDraftContent | null => {
  if (!value) return null;

  if (typeof value === 'object') return value;

  try {
    const raw = JSON.parse(value);
    return raw && Array.isArray(raw.blocks) ? raw : null;
  } catch (error) {
    return null;
  }
};

/**
 * Egy blokk szövegének darabolása: azonos entitás + stílus = egy darab.
 * A draft-js raw offsetjei kódpont (nem UTF-16) alapúak → Array.from.
 */
const renderBlockText = (
  block: RawBlock,
  entityMap: Record<string, RawEntity>,
  LinkComponent: (props: StaticLinkProps) => ReactNode,
) => {
  const chars = Array.from(block.text || '');

  if (!chars.length) {
    return <span><br data-text="true" /></span>;
  }

  const styles: string[][] = chars.map(() => []);
  const entities: (string | null)[] = chars.map(() => null);

  (block.inlineStyleRanges || []).forEach(({ offset, length, style }) => {
    for (let i = offset; i < Math.min(offset + length, chars.length); i++) styles[i].push(style);
  });

  (block.entityRanges || []).forEach(({ offset, length, key }) => {
    for (let i = offset; i < Math.min(offset + length, chars.length); i++) entities[i] = String(key);
  });

  // entitás-futamok, azon belül stílus-futamok (mint a draft-js leaf-ek)
  const out: ReactNode[] = [];
  let i = 0;

  while (i < chars.length) {
    const entityKey = entities[i];
    let end = i;
    while (end < chars.length && entities[end] === entityKey) end++;

    const leaves: ReactNode[] = [];
    let j = i;

    while (j < end) {
      const styleKey = styles[j].slice().sort().join(',');
      let leafEnd = j;
      while (leafEnd < end && styles[leafEnd].slice().sort().join(',') === styleKey) leafEnd++;

      const style = styles[j].reduce((acc, name) => ({ ...acc, ...(INLINE_STYLES[name] || {}) }), {});

      let text = chars.slice(j, leafEnd).join('');

      // mint a draft-js DraftEditorTextNode: a blokk végi sortörés csak egy
      // ráadás '\n'-nel látszik (white-space: pre-wrap)
      if (leafEnd === chars.length && text.endsWith('\n')) text += '\n';

      leaves.push(
        <span key={j} style={Object.keys(style).length ? style : undefined}>
          <span data-text="true">{text}</span>
        </span>,
      );

      j = leafEnd;
    }

    const entity = entityKey !== null ? entityMap[entityKey] : undefined;

    if (entity && entity.type === 'LINK') {
      const { url, href, target } = entity.data || {};

      out.push(
        <React.Fragment key={`e${i}`}>
          {LinkComponent({
            url: url || href || '',
            target,
            text: chars.slice(i, end).join(''),
            children: leaves,
          })}
        </React.Fragment>,
      );
    } else {
      out.push(<React.Fragment key={`t${i}`}>{leaves}</React.Fragment>);
    }

    i = end;
  }

  return out;
};

const renderBlock = (
  block: RawBlock,
  entityMap: Record<string, RawEntity>,
  LinkComponent: (props: StaticLinkProps) => ReactNode,
) => {
  const Element = (BLOCK_ELEMENTS[block.type] || 'div') as any;
  const list = LIST_WRAPPERS[block.type];

  const className = classNames(
    blockClassNames[block.type] || blockClassNames.unstyle,
    list && [
      list.itemClassName,
      'public-DraftStyleDefault-reset',
      `public-DraftStyleDefault-depth${block.depth || 0}`,
      'public-DraftStyleDefault-listLTR',
    ],
  );

  return (
    <Element key={block.key} className={className} data-block="true">
      <div className="public-DraftStyleDefault-block public-DraftStyleDefault-ltr">
        {renderBlockText(block, entityMap, LinkComponent)}
      </div>
    </Element>
  );
};

const WysiwygStatic = ({ value, linkComponent = DefaultLink }: PropTypes) => {
  const raw = parseRawContent(value);

  if (!raw) return null;

  const entityMap = raw.entityMap || {};
  const children: ReactNode[] = [];

  // egymást követő lista-elemek egy közös <ul>/<ol>-be (mint a draft-js)
  for (let n = 0; n < raw.blocks.length; n++) {
    const block = raw.blocks[n];
    const list = LIST_WRAPPERS[block.type];

    if (!list) {
      children.push(renderBlock(block, entityMap, linkComponent));
      continue;
    }

    const items: ReactNode[] = [];
    while (n < raw.blocks.length && raw.blocks[n].type === block.type) {
      items.push(renderBlock(raw.blocks[n], entityMap, linkComponent));
      n++;
    }
    n--;

    const Wrapper = list.element as any;
    children.push(<Wrapper key={`list-${block.key}`} className={list.className}>{items}</Wrapper>);
  }

  return (
    <div className="DraftEditor-root">
      <div className="DraftEditor-editorContainer">
        <div
          className="public-DraftEditor-content"
          style={{ outline: 'none', userSelect: 'text', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
        >
          <div data-contents="true">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default WysiwygStatic;
