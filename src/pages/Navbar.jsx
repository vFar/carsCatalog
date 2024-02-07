import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReact } from "@fortawesome/free-brands-svg-icons";
import {
  faCar,
  faCartShopping,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

const { Header } = Layout;

function Dashboard() {
  //useLocation piedāvā React-Router
  const location = useLocation();
  
  return (
    <>
      <Layout style={{backgroundColor: '#fafafa'}}>
        <Header className="dashboardHeader">
          
          <Link to="/" className="Link-logo">
            <FontAwesomeIcon className="dashboardBtn App-logo" icon={faCar}/>
          </Link>
        </Header>
      </Layout>
    </>
  );
}

export default Dashboard;
