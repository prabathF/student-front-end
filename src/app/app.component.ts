import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import {
  DrawerItem,
  DrawerSelectEvent,
  LayoutModule,
} from '@progress/kendo-angular-layout';
import { SVGIcon, menuIcon, userIcon } from '@progress/kendo-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, StudentsComponent, LayoutModule, ButtonsModule],
})
export class AppComponent {
  public selected = 'Inbox';
  public menuSvg: SVGIcon = menuIcon;

  public items: Array<DrawerItem> = [
    { text: 'Students', svgIcon: userIcon, selected: true },
  ];

  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
  }
}
