import React, { Component } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import FilteredWallpaperCreator from './FilteredWallpaperCreator';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightBlue" : "#00428d"
});

class FilteredWallpapersContainer extends Component {

  constructor (props) {
    super(props);
    this.state = {
      childList: []
    };
    this.createNewFilteredWallpaper = this.createNewFilteredWallpaper.bind(this);
    this.deleteWallpaper = this.deleteWallpaper.bind(this);
    this.addChild = this.addChild.bind(this);
    this.removeChild = this.removeChild.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:8000/data/wallpapers').then(res => {
      res.data.forEach(wallpaper => {
        this.addChild(wallpaper.id, wallpaper.filter, wallpaper.path);
      });
    });
  }

  createNewFilteredWallpaper() {
    // id will be new, filter will be default blank filter
    axios.post('http://localhost:8000/createblank').then(res => {
      this.addChild(res.data.id, res.data.filter, '');
    });
  }

  deleteWallpaper(id) {
    axios.delete(`http://localhost:8000/wallpaper/${id}`);
    this.removeChild(id);
  }

  updatePriorities(idList) {
    axios.put(`http://localhost:8000/priority`, idList);
  }

  addChild(id, filter, fileName) {
    const newNodeProps = {
        key: id,
        id: id,
        filter: filter,
        fileName: fileName,
        deleteHandler: this.deleteWallpaper
    };
    const children = this.state.childList.concat({
      id: id,
      nodeProps: newNodeProps
    });
    this.setState({
      childList: children
    });
  }

  removeChild(id) {
    const newChildList = this.state.childList.filter(child => {
      return child.id !== id
    });
    this.setState({
      childList: newChildList
    });
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.childList,
      result.source.index,
      result.destination.index
    );

    this.updatePriorities(items.map(item => item.id));
    this.setState({
      childList: items
    });
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              className="filtered-wallpapers-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <div id="filtered-wallpapers">
                {this.state.childList.map((item, index) => (
                  <FilteredWallpaperCreator
                    {...item.nodeProps}
                    index={index}
                  />
                ))}
              </div>
              <button id="create-new" onClick={this.createNewFilteredWallpaper}>Add New</button>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default FilteredWallpapersContainer;
