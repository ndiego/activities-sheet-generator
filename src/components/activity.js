import React from 'react';
import Markup from 'interweave';
import Moment from 'react-moment';

export default class Activity extends React.Component {

    render() {

        //console.log( this.props.children );

        const Entities = require('html-entities').XmlEntities;

        const entities = new Entities();

        return(
            <div className='activity-item'>
                <h2 className='title'>
                    <Markup content={ this.props.children[2].value } />
                </h2>
                <div className='metadata'>
                    <div className='location'>
                        { this.props.children[4].value }
                    </div>
                    <div className='time'>
                        <Moment format="LT">{ this.props.children[12].value }</Moment> - <Moment format="LT">{ this.props.children[13].value }</Moment>
                    </div>
                </div>
                <div>
                    <Markup
                        allowAttributes={ true }
                        allowElements={ true }
                        noHTML={ true }
                        content={ entities.decode( this.props.children[10].value ) } />
                    </div>
            </div>
        )

    }
}
