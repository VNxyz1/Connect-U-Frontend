import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'Connect-U-Frontend';

    constructor(library: FaIconLibrary) {
        this.fontawesomeSetup(library);
    }

    /**
     * brand Icons can be added with var: "fab".
     * For this project the [icon-library approach](https://github.com/FortAwesome/angular-fontawesome/blob/50cba302bbda97efd6cab68dd8ffe76c806f62c0/docs/usage/icon-library.md) is used.
     * @param library
     * @private
     */
    private fontawesomeSetup(library: FaIconLibrary): void {
        library.addIconPacks(fas, far);
    }
}
