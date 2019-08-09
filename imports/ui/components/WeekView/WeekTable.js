import Hour from "./Hour";
import React, { Component } from "react";
import GroupSchedule from "../../../api/group"
import { connect } from 'react-redux';
import Table from "react-bootstrap/Table";
import {Meteor} from "meteor/meteor";
import { withTracker } from 'meteor/react-meteor-data';
import uuid from "uuid";


class WeekTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        const DAYS = [0, 1, 2, 3, 4, 5];


        return (
            <Table className="groupTable">
                <thead>
                <tr>
                    <th></th>
                    <th>S</th>
                    <th>M</th>
                    <th>T</th>
                    <th>W</th>
                    <th>T</th>
                    <th>F</th>
                    <th>S</th>
                </tr>
                </thead>
                <thead>
                <tr>
                    <th></th>
                    <th>{this.props.moment.date()}</th>
                    {DAYS.map( day => (
                        <th key={uuid.v4()}>{this.props.moment.add(1, 'd').date()}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {HOURS.map(hour => (
                    <Hour h={hour} id={hour} key={uuid.v4()} allHours={this.props.week} group={this.props.gs}/>
                ))}
                </tbody>
            </Table>
        )
    }
}


export const WeekTracker = withTracker(({ availability }) => {
    Meteor.subscribe('group');
    const handle = Meteor.subscribe('group');
    const isReady = handle.ready();

    if (isReady) {
        let group = Meteor.users.find({_id: Meteor.userId()}).fetch()[0];

        if (typeof group != "undefined") {
            //get all the members in the group
            group = group.profile.group;
            let final = GroupSchedule.find({group: group, date: availability.date}).fetch()[0];
            return {
                gs: final, week: availability
            }
        }
    } else {
        return {week:availability}
    }


})(WeekTable);


const mapStateToProps = state => ({
    availability: state.WeekReducer
});


export default connect(mapStateToProps)(WeekTracker);
