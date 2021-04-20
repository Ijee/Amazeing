import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';


/**
 * Drag and drop functionality as a directive for a DOM element.
 *
 * Changes made but based on: https://github.com/MariemChaabeni/angular7-upload-file
 * @MariemChaabeni on Github
 */


@Directive({
  selector: '[appDropZone]'
})
export class DropZoneDirective {
  @Output() fileDropped = new EventEmitter<any>();

  // @HostBinding('style.background-color') private background = '';
  @HostBinding('style.opacity') private opacity = '1';

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(e): void {
    e.preventDefault();
    e.stopPropagation();
    // this.background = 'hsl(171, 100%, 41%)';
    this.opacity = '0.8';
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(e): void {
    e.preventDefault();
    e.stopPropagation();
    // this.background = '';
    this.opacity = '1';
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(e): void {
    e.preventDefault();
    e.stopPropagation();
    // this.background = 'hsl(171, 100%, 41%)';
    this.opacity = '1';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
