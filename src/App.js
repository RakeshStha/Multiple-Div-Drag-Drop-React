import React, { useState} from 'react';
import './App.css';
import {DragDropContext, Draggable, Droppable, } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid';

const Data = [
  {id: uuidv4(), content:"First items"},
  {id: uuidv4(), content:"Second items"}
]

const Columns = 
  {
    [uuidv4()]: {
      name: 'Todo',
      items: Data
    },
    [uuidv4()]: {
      name: 'In Progress',
      items: []
    }
  }

  const onDragEnd = (result, columns, setColumns) => {
    if(!result.destination) return;
    const {source, destination} = result;
    if(source.droppableId !== destination.droppableId){
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];

      const[removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed)
      setColumns({
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]:{
          ...destColumn,
          items:destItems
        }
      })

    }
    else{
      const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0 , removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    })
    }
  }

function App() {
  const [columns, setColumns] = useState(Columns)
  return (
    <div style={{display:'flex', justifyContent: "center", Height: '100%'}}>
     <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
      {Object.entries(columns).map(([id, column])=> {
        return (
          <div>
            <h1>{column.name}</h1>
            <div style={{margin: 8}}>
            <Droppable droppableId={id} key={id}>
            {(provided, snapshot)=> {
              return(
                <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{background: snapshot.isDraggingOver ? 'lightblue': 'lightgrey',
              padding: 4,
                width: 250,
              minHeight: 500
              }}
                >
                  {column.items.map((item, index)=> {
                    return(
                      <Draggable key={item.id} draggableId ={item.id} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <div ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              useSelect: "none",
                              padding: 16,
                              margin: '0 0 9px 0',
                              minHeight: '50px',
                              backgroundColor: snapshot.isDragging ? '#26384A' : '#456C86',
                              color: 'white',
                              ...provided.draggableProps.style
                            }}>
                              {item.content}
                            </div>
                          )
                        }}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )
            }}

          </Droppable>
            </div>
          </div>
        )
      })} 
      </DragDropContext>
    </div>
  );
}

export default App;
