import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { INote } from 'src/app/model/interfaces/note.interface';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss']
})
export class NoteModalComponent {

  idLog: string = 'NoteModalComponent'
  element: string = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public note: INote
  ){
    console.log({note});
    
  }

  addElement(){
    if(this.element.trim() != ''){
      this.note.checks.push({value: false, text: this.element, state: false})
      this.element = ''
    }
  }

  changeState(check: any, value: boolean, index: number){
    check.state = value
    if(value){
      setTimeout(() => {
        document.getElementById(`state_${index}`)?.focus()
      }, 1);
    }
    if(check.text.trim() == ''){
      this.note.checks.splice(index, 1)
    }
  }
}
