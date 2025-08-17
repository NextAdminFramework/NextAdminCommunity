namespace NextAdmin.UI {

    export class Separator extends Control {

        public static style = `

        .next-admin-separator{
            margin-top:40px;
            margin-bottom:40px;
            height:1px;
            background-color:#ccc;
            box-shadow:0px 0px 12px rgba(0,0,0,0.25);
        }
        `;

        constructor(options?: ControlOptions) {
            super('div', options);
            Style.append('NextAdmin.UI.Separator', Separator.style);
            this.element.classList.add('next-admin-separator');
        }

    }

}