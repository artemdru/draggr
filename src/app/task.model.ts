export class Task {
	constructor(
		public id: number, 
		public name: string, 
		public time: number, 
		public date: number, 
		public previousDate: number, 
		public isComplete: boolean){}
}