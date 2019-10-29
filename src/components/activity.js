import React from 'react';
import Markup from 'interweave';
import Moment from 'react-moment';

export default class Activity extends React.Component {

    render() {

        console.log( this.props );

        const Entities = require('html-entities').XmlEntities;

        const entities = new Entities();

        return(
            <div className='activity-item'>
                <h2 className='title'>
                    <Markup content={ this.props.title } />
                </h2>
                <div className='metadata'>
                    <div className='location'>
                        <Markup content={ this.props.location } />
                    </div>
                    <div className='time'>
                        <Moment format="LT">{ this.props.startDateTime }</Moment> - <Moment format="LT">{ this.props.stopDateTime }</Moment>
                    </div>
                </div>
                <div className='description'>
                    <Markup
                        allowAttributes={ true }
                        allowElements={ true }
                        noHTML={ true }
                        content={ entities.decode( this.props.longDescription ) } />
                </div>
            </div>
        )

    }
}
