import React, { useState, useRef, useEffect } from 'react';

interface ExpandableProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
}

const Expandable: React.FC<ExpandableProps> = ({
  children,
  height = 200,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(height);
  const [isExpandable, setIsExpandable] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setContentHeight(scrollHeight);

      // csak akkor expandable, ha nagyobb, mint a limit
      setIsExpandable(scrollHeight > height);
    }
  }, [children, height]);

  const toggleExpand = () => setExpanded(!expanded);

  return (
    <div className="relative w-full">
      <div
        className={className}
        ref={contentRef}
        style={{
          maxHeight: isExpandable
            ? expanded
              ? contentHeight
              : height
            : 'none',
          overflow: isExpandable ? 'hidden' : 'visible',
          transition: isExpandable ? 'max-height 0.3s ease' : undefined,
          position: 'relative',
        }}
      >
        {children}

        {/* FADE overlay csak ha expandable és nincs kinyitva */}
        {isExpandable && !expanded && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px',
              background: 'linear-gradient(to top, white, rgba(255,255,255,0))',
            }}
          />
        )}
      </div>

      {/* Gomb csak ha expandable */}
      {isExpandable && (
        <div
          className="text-center mt-2 pointer select-none"
          onClick={toggleExpand}
        >
          {!expanded
            ? 'Teljes tartalom megjelenítése'
            : 'Tartalom elrejtése'}
        </div>
      )}
    </div>
  );
};

export default Expandable;
