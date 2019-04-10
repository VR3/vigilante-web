import React, { Component } from 'react';
import { Sidebar, Menu, Grid } from 'semantic-ui-react';
import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyA1W5NZhhR1ZXeshgisr0kZR6cVSOU0Stk',
  authDomain: 'red-de-seguridad-iot.firebaseapp.com',
  databaseURL: 'https://red-de-seguridad-iot.firebaseio.com',
  projectId: 'red-de-seguridad-iot',
  storageBucket: 'red-de-seguridad-iot.appspot.com',
  messagingSenderId: '61463463592'
};
firebase.initializeApp(config);
var db = firebase.database();

class App extends Component {
  state = { visible: false, activeItem: null, reports: [], item: null };

  handleHideClick = () => this.setState({ visible: false });
  handleShowClick = () => this.setState({ visible: true });
  handleSidebarHide = () => this.setState({ visible: false });

  handleItemClick = (e, { name }) => {
    const item = this.state.reports.find(report => report.id === name);
    console.log(item);
    this.setState({ activeItem: name, visible: true, item });
  };

  fetchReports = () => {
    db.ref('/reports')
      .once('value')
      .then(snapshot => {
        const arr = Object.keys(snapshot.val()).map(i => snapshot.val()[i]);
        return this.setState({ reports: arr });
      })
      .catch(err => console.log('Firebase Error: ', err));
  };

  subscribeToEvents = () => {
    db.ref('/reports').on('child_added', querySnapshot => {
      let { reports } = this.state;
      const newReport = querySnapshot.val();
      reports.push(newReport);
      return this.setState({ reports });
    });
  };

  componentDidMount = () => {
    this.fetchReports();
    this.subscribeToEvents();
  };

  render() {
    const { visible, activeItem, reports, item } = this.state;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Menu pointing secondary vertical style={{ width: '105%' }}>
                {reports &&
                  reports.length > 0 &&
                  reports.map(report => {
                    return (
                      <Menu.Item
                        name={report.id}
                        active={activeItem === report.id}
                        onClick={this.handleItemClick}
                      >
                        {report.fname} {report.lname} ({report.date})
                      </Menu.Item>
                    );
                  })}
              </Menu>
            </Grid.Column>
            <Grid.Column width={12}>
              <Sidebar.Pushable style={{ height: '100vh' }}>
                <Sidebar
                  as={Menu}
                  animation="overlay"
                  direction="right"
                  onHide={this.handleSidebarHide}
                  inverted
                  vertical
                  visible={visible}
                  width="very wide"
                >
                  <Menu.Item as="a" header>
                    Datos de Reporte
                    <p>ID: {item && item.id}</p>
                    <p>Nombre(s): {item && item.fname}</p>
                    <p>Apellido(s): {item && item.lname}</p>
                    <p>Edad: {item && item.age}</p>
                    <p>Fecha: {item && item.date}</p>
                  </Menu.Item>
                </Sidebar>

                <Sidebar.Pusher>
                  <div class="mapouter">
                    <div class="gmap_canvas">
                      <iframe
                        title="gmaps"
                        width="100%"
                        height="850"
                        id="gmap_canvas"
                        src="https://maps.google.com/maps?q=vr3&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        frameborder="0"
                        scrolling="no"
                        marginheight="0"
                        marginwidth="0"
                      />
                    </div>
                  </div>
                </Sidebar.Pusher>
              </Sidebar.Pushable>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
