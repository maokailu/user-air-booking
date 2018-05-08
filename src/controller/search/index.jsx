import React from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import List from '../list';
import Detail from '../detail';
import Book from '../book';
import Login from '../login';
import utils from '../../resources/utils';
import Header from '../header';
import Footer from '../footer';
import CitySelector from '../../common/citySelector';
import DatePicker from '../../common/datePicker';
class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            departCity: {},
            arriveCity: {},
            tripType: 0,
            showCitySelector: false,
            showDatePicker: false,
            isDepartCity: true,
            idDepartDate: true,
            departDate: '',
            arriveDate: '',
            passenger: 1
        };
    }
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    componentDidMount() {
        this.initDepartCity();
    }
    initDepartCity = () => {
        utils.getPromise('http://localhost:8080/getCurrentCity').then(json => {
            json = JSON.parse(json);
            if (json.city) {
                this.setState({
                    departCity: json.city,
                    arriveCity: { cityName: '香港', cityCode: 'HKG' }
                }, () => {
                    localStorage.setItem('departCityCode', 'SHA');
                    localStorage.setItem('arriveCityCode', 'HKG');
                });
            }
        }, error => {
            console.error('出错了', error);
        });
    }
    clickDepartCity = () => {
        this.setState({
            showCitySelector: true,
            isDepartCity: true
        });
    }
    clickArriveCity = () => {
        this.setState({
            showCitySelector: true,
            isDepartCity: false
        });
    }
    changeCity = city => {
        if  (this.state.isDepartCity) {
            this.setState({
                departCity: city
            });
        } else {
            this.setState({
                arriveCity: city
            });
        }
    }
    clickDepartDate = () => {
        this.setState({
            showDatePicker: true,
            isDepartDate: true
        });
    }
    clickArriveDate = () => {
        this.setState({
            showDatePicker: true,
            isDepartDate: false
        });
    }
    selectDate = (isDepartDate, month, day) => {
        const date = `${month} ${day}`;
        if (isDepartDate) {
            this.setState({
                departDate: date
            });
        } else {
            this.setState({
                arriveDate: date
            });
        }
    }
    closeDatePicker = () => {
        this.setState({
            showDatePicker: false
        });
    }
    search = () => {
        if (this.state.departCity) {
            const path = {
                pathname: '/list',
                departCityCode: this.state.departCity.flightId
            };
            this.context.router.history.push(path);
        } else {
            console.log('please input departCity');
        }
    }
    expandHeader = () => {
        this.setState(prevState => ({ showHeaderMenu: !prevState.showHeaderMenu }));
        const path = {
            pathname: '/login'
        };
        this.context.router.history.push(path);
    }
    toggleTripType = () => {
        this.setState(prevState => ({
            tripType: prevState.tripType === 0 ? 1 : 0
        }));
    }
    closeCitySelector = () => {
        this.setState({
            showCitySelector: false
        });
    }
    minus = () =>{
        this.setState(prevState => ({
            passenger: prevState.passenger - 1
        }));
    }
    plus = () =>{
        this.setState(prevState => ({
            passenger: prevState.passenger + 1
        }));
    }
    render() {
        // debugger
        const tripType = this.state.tripType;
        return (
            <div className="search">
                <Header />
                <div className="category">
                    <span>Hotels</span>
                    <span className="tab-flights">Flights</span>
                    <span>Trains</span>
                </div>
                <div className="search-box">
                    <div className="tab" onClick={this.toggleTripType}>
                        <i className={'toggle-bar ' + (tripType === 0 ? 'left-tab' : 'right-tab')}/>
                        <div className="round_trip"
                            style={ tripType === 0 ? { color: '#fff' } : { color: '#2681FF' }}>Round Trip</div>
                        <div className="one_way"
                            style={ tripType === 0 ? { color: '#2681FF' } : { color: '#fff' }}>One-Way</div>
                    </div>
                    <div className="box" onClick={this.clickDepartCity}>
                        <span className="tit">From</span>
                        <div className="content">{this.state.departCity.cityName}</div>
                        <span className="code">All Airports</span>
                    </div>
                    <div className="box" onClick={this.clickArriveCity}>
                        <span className="tit">To</span>
                        <div className="content">{this.state.arriveCity.cityName}</div>
                        <span className="code">All Airports</span>
                    </div>

                    <div className="box hascolumn">
                        <div onClick={this.clickDepartDate}>
                            <div className="tit">Depart</div>
                            <span className="content">{this.state.departDate || 'Date'}</span>
                            <span className = "week">Today</span>
                        </div>
                        <div onClick={this.clickArriveDate}>
                            <div className="tit rdate">Arrive</div>
                            <span className="content">{this.state.arriveDate || 'Date'}</span>
                            <span className = "week">Today</span>
                        </div>
                    </div>

                    <div className="box hascolumn clearline">
                        <div className="class">
                            <div className="tit">Class</div>
                            <span className="content">Economy</span>
                        </div>
                        <div className="passenger">
                            <div className="tit">Passenger</div>
                            <span className="minus" onClick={this.minus}>--</span>
                            <span className="content number">{this.state.passenger}</span>
                            <span className="plus" onClick={this.plus}>++</span>
                        </div>
                    </div>
                    <div className="search-btn" onClick = {this.search}>Search</div>
                </div>
                <div className="footer-menu">
                    <div className="left">
                        <i className="icon-status"/>
                        <span>Flight Status</span>
                    </div>
                    <div className="right">
                        <i className="icon-bookings"/>
                        <span>My Bookings</span>
                    </div>
                </div>
                <Footer />
                {this.state.showCitySelector &&
                <CitySelector
                    cityCode = {
                        this.state.isDepartCity ? this.state.departCity.cityCode : this.state.arriveCity.cityCode
                    }
                    closeCitySelector = {this.closeCitySelector} changeCity={this.changeCity}
                    currentCityName = {this.state.isDepartCity ?
                        this.state.departCity.cityName : this.state.arriveCity.cityName}
                    labelText = {this.state.isDepartCity ? '出发城市' : '到达城市'}
                />}
                {this.state.showDatePicker &&
                <DatePicker closeDatePicker={this.closeDatePicker}
                    selectDate = {this.selectDate}
                    isDepartDate = {this.state.isDepartDate}
                />}
            </div>
        );
    }
}
const Home = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Search} />
            <Route path="/list" component={List} />
            <Route path="/detail" component={Detail} />
            <Route path="/book" component={Book} />
            <Route path="/login" component={Login} />
        </Switch>
    </Router>
);

export default Home
;
