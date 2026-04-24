import React from 'react';

import IconDrag from '../icon/mui/action/swap_vert';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  restrictToHorizontalAxis,
} from '@dnd-kit/modifiers';


import { CSS } from '@dnd-kit/utilities';

export function SortableItem(props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMouseDown = (e) => {

    if (e.target.tagName === "INPUT") {
      return false;
    }
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onMouseDown={handleMouseDown}>
      {props.children}
    </div>
  );
}

function Sortable({ elements, onDragEnd, horizontal = false, verical = true }) {

  const items = Object.keys(elements);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Csak akkor indul a drag, ha 10 pixelnél nagyobb távolságot mozdít el
      },
    })
  );

  const handleDragEnd = (event):void => {

    const {active, over, activatorEvent, delta} = event;
    
    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over?.id || active.id);
   
    onDragEnd({ oldIndex, newIndex, event: activatorEvent, delta: delta.y });
  }

  const modifiers = [];
  let strategy;

  if (!verical || !horizontal) {

    if (verical) {
      modifiers.push(restrictToVerticalAxis);
      strategy = verticalListSortingStrategy;
    }
    
    if (horizontal) {
      modifiers.push(restrictToHorizontalAxis);
      strategy = horizontalListSortingStrategy;
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      modifiers={modifiers}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items}
        strategy={horizontal? horizontalListSortingStrategy : verticalListSortingStrategy}
      >
        {items.map(id => <SortableItem key={id} id={id}>{elements[id]}</SortableItem>)}
      </SortableContext>
    </DndContext>
  );
}

export default Sortable;