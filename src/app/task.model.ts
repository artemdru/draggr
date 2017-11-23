export class Task {
	constructor(public id: number, public name: string, public time: number, public date: Date, public previousDate: Date, public isComplete: boolean){}
}