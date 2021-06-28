import React from 'react';
import Moment from 'react-moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import Activity from './activity';

export default class Input extends React.Component {

    constructor() {
        super();

        this.clearInput = this.clearInput.bind(this);
        this.parseInput = this.parseInput.bind(this);

        this.setDate = this.setDate.bind(this);
        this.enableMovies = this.enableMovies.bind(this);
        this.setMovieDescription = this.setMovieDescription.bind(this);
        this.onCopyUrl = this.onCopyUrl.bind(this);
        this.copyToggle = this.copyToggle.bind(this);

        //const today = new Date();
        const tomorrow = new Date( +new Date() + 86400000 );

        this.state = {
            xml: [],
            date: tomorrow.toLocaleDateString(),
            copied: false,
            moviesEnabled: false,
            movieDescription: 'Join us in our 16-seat theater to enjoy the movies scheduled today. Movies are first come first serve, seats will not be reserved.',
            movies: [
                { movie: '8:00 AM - Movie Title (Rating)' },
                { movie: '12:00 PM - Movie Title (Rating)' },
                { movie: '3:00 PM - Movie Title (Rating)' },
                { movie: '6:00 PM - Movie Title (Rating)' },
                { movie: '9:00 PM - Movie Title (Rating)' },
            ],

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

    enableMovies(e) {
        this.setState({ moviesEnabled: e.target.checked })
    }
    setMovieDescription() {
        this.setState({ movieDescription: this.movieDescription.value });
    }

    getMovies() {
        return this.state.movies.map((movie, index) => {

            return (
                <div className='movie-item' ref={ index }>

                    <input
                        className={ 'movie-timeslot' }
                        type="text"
                        placeholder={ '00:00 AM - Movie Title (Rating)' }
                        value={movie.movie}
                        onChange={ this.handleMovieChange(index) }
                    />
                    <button
                        className={ 'btn remove-movie' }
                        type="button"
                        onClick={ this.handleRemoveMovie(index) }
                    >
                      Remove
                    </button>
                </div>
                );
        });
    }

    handleMovieChange = idx => evt => {
        const newMovies = this.state.movies.map((movie, sidx) => {
            if ( idx !== sidx ) return movie;
            return { ...movie, movie: evt.target.value };
        });

        this.setState({ movies: newMovies });
    };

    handleRemoveMovie = idx => () => {
        this.setState({
            movies: this.state.movies.filter((s, sidx) => idx !== sidx)
        });
    };

    handleAddMovie = () => {
        this.setState({
            movies: this.state.movies.concat([{ movie: '00:00 AM - Movie Title (Rating)' }])
        });
    };

    handleMovieTimeChange() {

    }

    handleRemoveMovie() {

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

                <div className='movie-settings-container'>
                    <div className='step-title'>Step  4</div>
                    <h2>Movies</h2>
                    <p>
                        <label>
                            <input
                                type='checkbox'
                                checked={ this.state.moviesEnabled }
                                onChange={ this.enableMovies }
                            /> Enable Movie Times (Optional)
                        </label>
                    </p>
                    { this.state.moviesEnabled &&
                        <div className='movie-settings'>
                            <p>Edit the movie information below as needed. If you do not want to show movie times on the activity sheet, simply disable this setting.</p>
                            <textarea
                                className='movie-description'
                                ref={ c => this.movieDescription = c }
                                placeholder={ 'Join us in our 16-seat theater to enjoy the movies scheduled today. Please speak with one of our guest advocates at the front desk to request popcorn. Movies are first come first serve, seats will not be reserved.' }
                                rows='4'
                                value={ this.state.movieDescription }
                                onChange={ this.setMovieDescription }
                            />
                            <div className='movie-items'>
                                { this.getMovies() }
                                <button
                                    className='btn add-movie'
                                    type="button"
                                    onClick={ this.handleAddMovie }
                                >
                                  Add Timeslot
                                </button>
                            </div>
                        </div>
                    }
                </div>

                { hasActivities &&
                    <div className='activities-container'>
                        <div className='activities-header'>
                            <h1>Activities</h1>
                        </div>
                        <div className='activity-items'>
                            <div className='activity-item current-date'>
                                <h1><Moment format="MMMM D, YYYY">{ this.state.date }</Moment></h1>
                            </div>
                            { this.state.moviesEnabled &&
                                <div className='activity-item'>
                                    <h2 className='title'>
                                        Daily Movie Schedule
                                    </h2>
                                    <div className='metadata'>
                                        <div className='location'>
                                            Movie Theater
                                        </div>
                                    </div>
                                    <div className='description'>
                                        <p>{ this.state.movieDescription }</p>
                                        <ul>
                                            { this.state.movies.map((movie, index) => {

                                                return (
                                                    <li ref={ index }>{movie.movie}</li>
                                                    );
                                            }) }
                                        </ul>
                                    </div>
                                </div>
                            }
                            { this.getActivities() }
                        </div>
                        <div className='step-title last'>Step  5</div>
                        <div className='print-page'>
                            <button className="btn print" onClick={ () => window.print() }>Print Activity Sheet</button>
                            <p>When printing, make sure that the "Headers and footers" checkbox is <strong>not</strong> selected in the print dialog box. This setting is located in the "More settings" tab.</p>
                        </div>
                    </div>
                }

            </div>
        );
    }
}
