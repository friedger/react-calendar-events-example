import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Panel, Grid, Row, Col } from 'react-bootstrap';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

let localizer = BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

class EventCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInstructions: true,
      eventModal: undefined
    };

    this.bound = [
      'handleHide',
      'handleHideInstructions',
      'handleAddEvent',
      'handleEditEvent'
    ].reduce((acc, d) => {
      acc[d] = this[d].bind(this);
      return acc;
    }, {});
  }

  componentWillMount() {
    this.props.GetInitialEvents(window.location.search);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inviteSuccess) {
      this.setState({ eventModal: undefined });
    }
  }
  handleHide() {
    this.setState({ eventModal: undefined });
  }

  handleHideInstructions() {
    this.setState({ showInstructions: false });
  }

  handleEditEvent(event) {
    console.log('handleEditEvent', event);
    this.setState({
      eventModal: {
        eventType: 'edit',
        eventInfo: event
      }
    });
  }

  handleAddEvent(slotInfo) {
    console.log('handleAddEvent');
    slotInfo.id = this.props.events.allEvents.length; // currentIndex
    this.setState({
      eventModal: {
        eventType: 'add',
        eventInfo: slotInfo
      }
    });
  }

  eventStyle(event, start, end, isSelected) {
    var bgColor = event && event.hexColor ? event.hexColor : '#265985';
    var style = {
      backgroundColor: bgColor,
      borderRadius: '5px',
      opacity: 1,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style: style
    };
  }

  getEventStart(eventInfo) {
    return eventInfo ? new Date(eventInfo.start) : new Date();
  }

  getEventEnd(eventInfo) {
    return eventInfo ? new Date(eventInfo.end) : new Date();
  }

  render() {
    const { signedIn } = this.props;
    const { showInstructions } = this.state;
    const { EventDetails } = this.props;
    const {
      handleHide,
      handleShow,
      handleHideInstructions,
      closeDetails,
      handleEditEvent,
      handleAddEvent
    } = this.bound;
    console.log('allevents', this.props.events.allEvents);
    return (
      <div className="bodyContainer">
        {/* :Q: would you like anything to appear on the screen after a user opted to hide the instructions? */}
        {signedIn && showInstructions && (
          <Panel>
            <Panel.Heading>
              Instructions
              <button
                type="button"
                className="close"
                onClick={handleHideInstructions}
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            </Panel.Heading>
            <Panel.Body>
              <Grid>
                <Row style={{ textAlign: 'left' }}>
                  <Col md={5}>
                    <strong>To add an event: </strong> Click on the day you want
                    to add an event or drag up to the day you want to add the
                    event for multiple day event! <br />
                  </Col>
                  <Col md={5}>
                    <strong>To update and delete an event:</strong> Click on the
                    event you wish to update or delete!
                  </Col>
                </Row>
              </Grid>
            </Panel.Body>
          </Panel>
        )}
        {!signedIn && (
          <Panel>
            <Panel.Heading>
              Private, Encrypted Calendar in the Cloud
              <button
                type="button"
                class="close"
                onClick={handleHideInstructions}
              >
                <span aria-hidden="true">×</span>
                <span className="sr-only">Close</span>
              </button>
            </Panel.Heading>
            <Panel.Body>
              <strong>To learn about Blockstack: </strong> A good starting point
              is{' '}
              <a href="https://docs.blockstack.org">
                Blockstack's documentation
              </a>
              .<br />
              <strong>I have already a Blockstack ID:</strong> Just sign in
              using the blockstack button above!
            </Panel.Body>
          </Panel>
        )}
        {this.state.eventModal && (
          <EventDetails handleHide={handleHide} {...this.state.eventModal} />
        )}
        <BigCalendar
          localizer={localizer}
          selectable={this.props.signedIn}
          events={this.props.events.allEvents}
          views={allViews}
          step={60}
          showMultiDayTimes
          defaultDate={new Date(moment())}
          onSelectEvent={event => handleEditEvent(event)}
          onSelectSlot={slotInfo => handleAddEvent(slotInfo)}
          style={{ minHeight: '500px' }}
          eventPropGetter={this.eventStyle}
          startAccessor={this.getEventStart}
          endAccessor={this.getEventEnd}
        />
      </div>
    );
  }
}

export default EventCalendar;
