import {ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatParticipant, Message, ParticipantResponse} from 'ng-chat';
import {Observable, of} from 'rxjs';

export class MyAdapter extends ChatAdapter {

  public messages = [];

  constructor(private ws: WebSocket, public activeUsers: IChatParticipant[]) {
    super();
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    return of(this.messages);
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return of(this.activeUsers.map(user => {
      const participantResponse = new ParticipantResponse();
      participantResponse.participant = user;
      return participantResponse;
    }));
  }

  sendMessage(message: Message): void {
    this.ws.send(JSON.stringify({'from': +localStorage.getItem('userId'), 'to': message.toId, 'text': message.message, 'time': message.dateSent.getTime()}));
    this.messages.push(message);
  }

}