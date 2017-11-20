import {animation, style, animate} from "@angular/animations";
export var fadeAnimation = animation([
  style({ opacity: "{{ from }}" }), animate("{{ time }}", style({ opacity: "{{ to }}" })  ) ], { params: { time: "1s", from: 0, to: 1 } })
