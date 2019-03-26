import React from 'react';
import DemoStore from '../stores/DemoStore';
import DemoAction from '../actions/DemoAction';
import uuid from 'uuid';

class DemoView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: DemoStore.getNumber()
    };
    this.create = this.create.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    DemoStore.addChangeListener(this.onChange);
  }
  componentWillUnmount() {
    DemoStore.removeChangeListener(this.onChange);
  }
  onChange() {
    this.setState({
      number: DemoStore.getNumber()
    });
  }
  create() {
    DemoAction.create({ id: uuid.v4(), content: '3rd stuff' });
  }
  render() {
    return (
      <div>
        <div>{this.state.number}</div>
        <button onClick={this.create}>增加</button>
      </div>
    );
  }
}

export default DemoView;
