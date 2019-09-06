import {ChatAdapter, ChatParticipantStatus, ChatParticipantType, IChatParticipant, Message, ParticipantResponse} from 'ng-chat';
import {Observable, of} from 'rxjs';

export class MyAdapter extends ChatAdapter {

  public mockedParticipants: IChatParticipant[] = [
    {
      participantType: ChatParticipantType.User,
      id: 2,
      displayName: 'Angela',
      avatar: 'https://66.media.tumblr.com/avatar_9dd9bb497b75_128.pnj',
      status: ChatParticipantStatus.Online
    }];

  public messages = [];

  constructor() {
    super();
    const message = new Message();
    message.fromId = 'Mike';
    message.toId = 'Angela';
    message.message = 'Hi Angela!';
    const message2 = new Message();
    message2.fromId = 'Angela';
    message2.toId = 'Mike';
    message2.message = 'Hi Mike!';
    this.messages.push(message);
    this.messages.push(message2);
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {

    return of(this.messages);
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return of(this.mockedParticipants.map(user => {
      const participantResponse = new ParticipantResponse();

      participantResponse.participant = user;
      participantResponse.metadata = {
        totalUnreadMessages: Math.floor(Math.random() * 10)
      }

      return participantResponse;
    }));
  }

  sendMessage(message: Message): void {
    this.messages.push(message);
  }

}

