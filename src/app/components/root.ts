import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ RouterModule ],
  template: '<router-outlet />'
})
export class Root {
  
}
