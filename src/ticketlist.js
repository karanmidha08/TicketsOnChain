import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
//import WalletConnect from "@walletconnect/browser";
//import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import TickesOnChain from "./contracts/TicketsOnChain.json";
import Web3Connect from "web3connect";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container,Row,Col, Card,CardHeader,CardTitle,CardBody, Button } from "shards-react";
export default class CreateToken extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      events:[],
      flag:false,
      zero:false,
      web3: null,
      instance:null,
      accounts: this.props.account,
      superWeb3: this.props.web3,
      superContract:this.props.contract,
      
    }
    //this.state.walletConnector.killSession();
  }
  checkIn = async(id)=>{
   
     let provider = await Web3Connect.ConnectToWalletConnect(
      WalletConnectProvider,
      {
        infuraId: "311ef590f7e5472a90edfa1316248cff", // required
        bridge: "https://bridge.walletconnect.org" // optional
      }
    );
    console.log(provider);
    await provider.close();
    console.log(provider);
      provider =  new WalletConnectProvider({
      infuraId: "311ef590f7e5472a90edfa1316248cff"
    });
   
    await provider.enable()
    const web3 = new Web3(provider);
      let acc = await web3.eth.getAccounts();
      const deployedNetwork = TickesOnChain.networks[42];
      const instance = new web3.eth.Contract(
        TickesOnChain.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log(acc);
     
      const  response = await instance.methods.checkIn(id).send({from: acc[0] });
      console.log(response);
      await provider.close();
      return true;
    
  }
  withdrawAmount= async (id)=>{
    const {superContract,superWeb3} = this.state;
    console.log(id);
    console.log("web3 not  available");
    if(this.state.superWeb3!= null){
      console.log("web3 available");
     const superAccount = await superWeb3.eth.getAccounts();
       let response = await superContract.methods.withdraw(id).send({from: superAccount[0], })
       alert("Done\n"+response);
    }
  }
  disableEvent= async (id)=>{
    const {superContract,superWeb3} = this.state;
    console.log(id);
    console.log("web3 not  available");
    if(this.state.superWeb3!= null){
      console.log("web3 available");
     const superAccount = await superWeb3.eth.getAccounts();
       let response = await superContract.methods.turnEventOff(id).send({from: superAccount[0], })
       alert("Done\n"+response);
    }
  }
  fetchHostedNetwork = async ()=>{
   
    const {superWeb3,superContract} = this.state;
    console.log("tickets");
    //console.log(superContract);
    let _events =[];
    const accounts = await superWeb3.eth.getAccounts();
    let response = await superContract.methods.UserProfile().call({from:accounts[0]});
    console.log("asdsad");
    console.log(response[0].length);
    if(response==null){
      this.setState({zero:true});
    }
    else if(response[0].length==0){
      this.setState({zero:true});
    }
        for(let i =0; i<response[0].length;i++){
      let event = await superContract.methods.eventMapping(response[0][i]).call();
      _events.push(event);
    }
    console.log(_events);
    this.setState({events:_events,flag:true});
  }
  render(){
  
    
    if(this.state.superWeb3!= null && this.state.superContract !=null){
      
      if(!this.state.flag)
        {
          this.fetchHostedNetwork();
          
        }
        let listHost;
        if(!this.state.flag){
          listHost = <center> <h6> Loading..: <Loader
          type="Puff"
          color="black"
          height={100}
          width={100}
          timeout={3000} //3 secs
  
       /></h6></center>;
        }
        else if(this.state.zero){
          listHost =  <Container className="main-container">
          <Row>
            <Col sm="12" md="12">
              <div>
        
                <Card>
                 
                  
                  <CardBody className="WEB3">
                 <center>   <CardTitle>You are not hosting any event</CardTitle>
                    </center>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>;
        }
        else {
          listHost = this.state.events.map((item, index)=>
              <Card style={{marginTop: "30px"}}>
              <CardHeader>Event</CardHeader>
              <CardBody className="Ticket">
                <CardTitle>{item[4]}</CardTitle>
                <CardTitle>{item[9]}</CardTitle>
                
                <Link to = {{
                  pathname: '/check-in',
                  aboutProps:{
                    id: item[10],
                    superContract: this.state.superContract,
                    superWeb3: this.state.superWeb3
                  }
                }}>
                <Button outline pill >Start Checking In</Button>
                </Link>
                <t/><t/>
                <Link to = {{
                  pathname: '/sales',
                  aboutProps:{
                    id: item[10],
                    superContract: this.state.superContract,
                    superWeb3: this.state.superWeb3
                  }
                }}>
                <Button outline pill  >Ticket Sales</Button>
                </Link>
                <t/><t/>
                <Button outline pill onMouseUp={()=>{this.withdrawAmount(item[10])}}>Withdraw Amount</Button>
                <t/><t/>
                <Button outline pill onMouseUp={()=>{this.disableEvent(item[10])}}>End Event</Button>
              </CardBody>
            </Card>
        );
        }
       
        
      return(
        <div>
          <Container className="main-container">
            <Row>
              <Col sm="12" md="12">
                <div>
                  <h3>Events you are hosting</h3><hr/> <br />
                  {listHost}
                </div>
              </Col>
            </Row>
          </Container>
          <Container className="main-container">
            
          </Container>
        </div>
        
      );
    }
    else{
      if((this.state.superWeb3==null||this.state.superContract ==null)&&(this.props.web3!=null)){
        this.state.superWeb3= this.props.web3;
        this.state.superContract=this.props.contract;
        this.state.accounts=this.props.account;
      }
      return(<div>
        <Container className="main-container">
          <Row>
            <Col sm="12" md="12">
              <div>
        
                <Card>
                 
                  
                  <CardBody className="WEB3">
                 <center>   <CardTitle>Please Connect to Web3</CardTitle>
                    </center>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
     );
    }
    
  }

}
// onClick={async ()=>{
//   let con =true
//   while(con){
//     try{
//       con =await this.checkIn(item[10])
//     }
//     catch(err){
      
//     }
    
//     console.log(con+"asdads");
//   }
//   }}