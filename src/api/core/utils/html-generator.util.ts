import { randomInt } from "crypto";

export class HTMLGenerator {
    public static generateActionButton(
        btn_title: string,
        btn_action_class: string,
        btn_style_class: string = "btn-purple-ghost",
        btn_icon_class: string = "bx-pencil"
    ): string {
        return `
            <button type="button" class="btn btn-icon ${btn_style_class} btn-wave ${btn_action_class}" title="${btn_title}"><i class="bx ${btn_icon_class}"></i></button>
        `;
    }

    public static generateBadge(
        badge_label: string,
        class_name: string = "bg-outline-light text-dark"
    ): string {
        return `<span class="badge ${class_name}">${badge_label}</span>`;
    }

    public static generateLink(
        link_url: string,
        link_text: string,
        link_tooltip: string
    ): string {
        return `
            <a href="${link_url}" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-primary" title="${link_tooltip}" class="text-primary">${link_text}</a>
        `;
    }


    public static getBootstrapClassesAsArray(
        transparent: boolean = false,
        type: 'bg' | 'text' | 'border' = 'bg',
        randomOne: boolean = false
    ): string[] {
        const baseClasses = [
            "bg-purple",
            "bg-blue",
            "bg-green",
            "bg-orange",
            "bg-red",
            "bg-teal",
            "bg-indigo",
            "bg-pink",
            "bg-cyan",
            "bg-lime",
            "bg-yellow",
            "bg-gray",
            "bg-gray-dark",
            "bg-primary",
            "bg-secondary",
            "bg-success",
            "bg-info",
            "bg-warning",
            "bg-danger",
            "bg-light",
            "bg-dark",
        ];

        const transparentSuffix = transparent ? "-transparent" : "";

        let selectedClasses: string[];

        if (randomOne) {
            const randomIndex = randomInt(0, baseClasses.length - 1);
            const randomClass = baseClasses[randomIndex] + transparentSuffix;

            switch (type) {
                case 'bg':
                    selectedClasses = [randomClass];
                    break;
                case 'text':
                    selectedClasses = ["text-" + randomClass.replace("bg", "")];
                    break;
                case 'border':
                    selectedClasses = ["border-" + randomClass.replace("bg", "")];
                    break;
                default:
                    selectedClasses = [];
                    break;
            }
        } else {
            switch (type) {
                case 'bg':
                    selectedClasses = baseClasses.map(cls => cls + transparentSuffix);
                    break;
                case 'text':
                    selectedClasses = baseClasses.map(cls => "text-" + cls.replace("bg", "") + transparentSuffix);
                    break;
                case 'border':
                    selectedClasses = baseClasses.map(cls => "border-" + cls.replace("bg", "") + transparentSuffix);
                    break;
                default:
                    selectedClasses = [];
                    break;
            }
        }

        return selectedClasses;
    }
}