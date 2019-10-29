import React from 'react';
import Moment from 'react-moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTimeout from 'react-timeout';

import Activity from './activity';

export default class Input extends React.Component {

    constructor() {
        super();

        this.clearInput = this.clearInput.bind(this);
        this.parseInput = this.parseInput.bind(this);

        this.setDate = this.setDate.bind(this);
        this.onCopyUrl = this.onCopyUrl.bind(this);
        this.copyToggle = this.copyToggle.bind(this);

        const today = new Date();

        this.state = {
            xml: [],
            date: today.toLocaleDateString(),
            copied: false
        };
    }

    clearInput(e) {
        e.preventDefault();

        this.input.value = '';
        this.setState({ xml: [] });
    }

    parseInput(e) {
        e.preventDefault();

        const xmlRaw = this.input.value.trim();

        const parser = new DOMParser();
        const parsedXml = parser.parseFromString( xmlRaw, "text/xml" );
        const events = [...parsedXml.querySelectorAll( "event")];

        this.setState({ xml: events });
    }

    getActivities() {
        return this.state.xml.map((xml, index) => {

            const title = xml.getElementsByTagName( 'title' )[0].innerHTML;
            const location = xml.getElementsByTagName( 'locationname' )[0].innerHTML;
            const startDateTime = xml.getElementsByTagName( 'startdate' )[0].innerHTML;
            const stopDateTime = xml.getElementsByTagName( 'enddate' )[0].innerHTML;
            const shortDescription = xml.getElementsByTagName( 'shortdescription' )[0].innerHTML;
            const longDescription = xml.getElementsByTagName( 'longdescription' )[0].innerHTML.trim();

            console.log(title);
            return <Activity
                title={ title }
                location={ location }
                startDateTime={ startDateTime }
                stopDateTime={ stopDateTime }
                shortDescription={ shortDescription }
                longDescription={ longDescription }
                key={ index }/>
        });
    }

    setDate() {
        this.setState({ date: this.date.value });
    }

    copyToggle() {
        this.setState({ copied: !this.state.copied })
    }

    onCopyUrl() {
      this.setState({ copied: true });
      setTimeout( this.copyToggle, 5000 )
    }

    render() {
        const hasActivities = this.state.xml.length ? true : false ;
        const xmlLink = 'https://www.mountainviewgrand.com/activities-calendar.aspx?format=xmlfeed&startdate=' + this.state.date + '&enddate=' + this.state.date;
        const sourceLink = 'view-source:' + xmlLink;
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
                                onChange={ this.setDate }
                            />
                        </div>
                        <div className='xml-link-container'>
                            <CopyToClipboard
                                text={ sourceLink }
                                onCopy={ this.onCopyUrl }>
                                    <button className='btn getXML'>
                                        { this.state.copied ? 'URL Copied' : 'Copy Source URL' }
                                    </button>
                            </CopyToClipboard>
                        </div>
                    </div>

                    <p className='view-source-url' ref={ c => this.url = c }>view-source:{ xmlLink }</p>

                    <div className='step-title'>Step  2</div>
                    <p>Copy the activity source URL and paste it into new Chrome browser window. Render the page and you will see a large block of XML code. Using keyboard shortcuts, select all (Ctrl A). Then copy (Ctrl C) all of the content.</p>

                    <div className='step-title'>Step  3</div>
                    <p>Return to this page and paste (Ctrl V) the copied XML into the textbox below. Then generate the activities list using the button below.</p>

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
