import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { INote } from 'src/app/model/interfaces/note.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  noteCollection: AngularFirestoreCollection<INote>
  constructor(
    private angularFirestore: AngularFirestore,
  ) { 
    this.noteCollection = this.angularFirestore.collection('notes')
  }

  createOrUpdate(note: INote){
    if(note.idNote){
      // actualización
      note.updatedAt = Date.now()
    } else {
      // nueva nota
      note.idNote = note.idNote || this.angularFirestore.createId()
      note.createdAt = Date.now()
      note.updatedAt = Date.now()
    }
    return this.noteCollection.doc(note.idNote).set(note)
  }

}
