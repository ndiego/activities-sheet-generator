import React from 'react';
import XMLParser from 'react-xml-parser';
import Moment from 'react-moment';

import Activity from './activity';

export default class Input extends React.Component {

    constructor() {
        super();

        this.clearInput = this.clearInput.bind(this);
        this.parseInput = this.parseInput.bind(this);

        this.setDate = this.setDate.bind(this);

        const today = new Date();
        const currentDate = <Moment format='LT'>{ today }</Moment>;
        console.log(today.toLocaleDateString());

        this.state = {
            xml: [],
            date: today.toLocaleDateString()
        };
    }

    clearInput(e) {
        e.preventDefault();

        this.input.value = '';
        this.setState({ xml: [] });
    }

    parseInput(e) {
        e.preventDefault();

        const xmlInput = new XMLParser().parseFromString( this.input.value );

        console.log( xmlInput );
        this.setState({ xml: xmlInput.children });
    }

    getActivities() {
        return this.state.xml.map((xml) => {
            return <Activity
               {...xml}
               key={ 1 }/>
           });
    }

    setDate() {

        this.setState({
            date: this.date.value
        });
    }

    render() {
        const hasActivities = this.state.xml.length ? true : false ;
        const xmlLink = 'https://www.mountainviewgrand.com/activities-calendar.aspx?format=xmlfeed&startdate=' + this.state.date + '&enddate=' + this.state.date;
        return (
            <div className="container">

                <div className="input-container">
                    <h1>Activity Sheet Generator</h1>
                    <div className='step-title'>Step  1</div>
                    <p>Begin by entering the date that you want to pull activities for or use the default. The default is set to today's date. Make sure to use the format MM/DD/YYYY.</p>
                    <div className='date-controls'>
                        <div className='date-container'>
                            <span className='date-title'>Date</span>
                            <input
                                className='date'
                                placeholder={ this.state.date }
                                ref={ c => this.date = c }
                                onChange={this.setDate}
                            />
                        </div>
                        <div className='xml-link-container'>
                            <a className='btn getXML' href={ xmlLink } target='_blank'>XML Source Code</a>
                        </div>
                    </div>
                    <p className='view-source-url'>view-source:{ xmlLink }</p>

                    <div className='step-title'>Step  2</div>
                    <p>Next, either click on the <em>XML Source Code</em> button, or copy and paste the full url above into another window of our Chrome browser.</p>
                    <p>NEEDS WORK....On the resulting page, copy and paste the content</p>

                    <div className='step-title'>Step  3</div>
                    <p>Paste in copied XML in the textbox below.</p>
                    <textarea
                        className='input'
                        ref={ c => this.input = c }
                        placeholder={ 'Paste the XML here...' }
                        rows='10'
                    />
                    <div className='input-controls'>
                        <div className='input-clear'>
                            <button className='btn clear' onClick={ this.clearInput }>Clear XML Code</button>
                        </div>
                        <div className='input-submit'>
                            <button className='btn submit' onClick={ this.parseInput }>Generate Activities</button>
                        </div>
                    </div>
                </div>

                { hasActivities &&
                    <div className='activities-container'>
                        <div className='activities-header'>
                            <h1>Activities</h1>
                        </div>
                        <div className='activity-items'>
                            { this.getActivities() }
                        </div>
                        <div className='step-title last'>Step  4</div>
                        <div className='print-page'>
                            <button className="btn print" onClick={ () => window.print() }>Print Activity Sheet</button>
                        </div>
                    </div>
                }

            </div>
        );
    }

}
