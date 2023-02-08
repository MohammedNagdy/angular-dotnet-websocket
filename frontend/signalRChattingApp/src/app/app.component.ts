import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild("message") message :ElementRef;
  @ViewChild("group") groupId: ElementRef;

  private hubConnection;
  messages: string[] = ["message1"];

  ngOnInit(){
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:5000/chat',{
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();

    
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started!');
        this.hubConnection.on('ReceiveMessage', (message) => { 
          alert(message);
        });
      })
      .catch(err => console.log('Error while establishing connection :('));

    // this.hubConnection.on('SendToAll', (receivedMessage) => {
    //     const text = `${receivedMessage}`;
    //     this.messages.push(text);
    //     console.log("sent!!")
    //   });

    this.hubConnection.on('SendToGroup', (receivedMessage) => {
      const text = `${receivedMessage}`;
      this.messages.push(text);
      console.log("sent to group!!")
    });

  }

  onChoose(){
    let group = this.groupId.nativeElement.options[this.groupId.nativeElement.selectedIndex].value
    console.log("Choosed this!")
    this.hubConnection
        .invoke('JoinGroup', group)
        .catch(err => console.error(err));
  }
  

  onSend(){
    let group = this.groupId.nativeElement.options[this.groupId.nativeElement.selectedIndex].value
    console.log("The group: ", group)  
    this.hubConnection
        .invoke('SendToGroup', group ,this.message.nativeElement.value)
        .catch(err => console.error(err));
      this.message.nativeElement.value = '';
    
      // console.log("Sent message", this.message.nativeElement.value)
      // this.hubConnection
      //   .invoke('SendToAll', this.message.nativeElement.value)
      //   .catch(err => console.error(err));
      // this.message.nativeElement.value = '';
    
  }
}
