// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: 'http://45.76.123.59:5000/api/',
  // photoUrl: 'http://gradspace.org:5000/',  
  baseUrlForChatting: 'http://45.76.123.59:5000/',
   baseUrl: 'http://localhost:5000/api/',
   photoUrl: 'http://localhost:5000/',  
  // baseUrl: 'http://192.168.178.76:5000/api/',
  companyName: 'Able Music Studio',
  siteName: 'Project Pegasus'
};

export const instrumentIcon =[
  {id:0,name:'Group',url:'../../../../../../Group.png'},
  {id:1,name:'Piano',url:'../../../../../../Piano.svg'},
  {id:2,name:'Drum',url:'../../../../../../Drum.png'},
  {id:3,name:'Guitar',url:'../../../../../../Guitar.png'},
  {id:4,name:'Violin',url:'../../../../../../Violin.png'},
  {id:5,name:'Cello',url:'../../../../../../Cello.png'},
  {id:6,name:'Singing',url:'../../../../../../voice.png'},
  {id:7,name:'Theory',url:'../../../../../../Theory.png'},
  {id:8,name:'Aural',url:'../../../../../../Aural.svg'},
  {id:7,name:'Others',url:'../../../../../../Others.svg'},
]
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
