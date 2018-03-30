export class Task {
	constructor(
		public id: number, 
		public name: string, 
		public time: number, 			// As opposed to storing task dates as Dates objects,
		public date: number, 			// dates are stored in their .getTime() value, which
		public previousDate: number, 	// is an integer for milliseconds since 1/1/1970 UTC.
		public color: string,
		public isComplete: boolean){}
}