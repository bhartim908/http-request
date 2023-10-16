import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { catchError, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http:HttpClient) { }



  //create data from form and store that data into database using post request
  createAndStorePosts(postData:{title:string,content:string}){
   this.http.post<{title:string,content:string}>("https://ng-new-httprequest-62cd9-default-rtdb.europe-west1.firebasedatabase.app/posts.json",postData)
    .subscribe(responseData => {
     console.log(responseData);
    }
  )

  }
   
  //fetch data from database
  fetchPosts(){
    return this.http.get<{[key:string]:Post}>("https://ng-new-httprequest-62cd9-default-rtdb.europe-west1.firebasedatabase.app/posts.json")
    //catchError is for error handling --->
    .pipe(
      retry(5),catchError(this.httpErrorHandler)).pipe(
    //-->
    (map(response => {
      let postArrays:Post[]=[];
      for( const key in response) {
      if(response.hasOwnProperty(key))
      {
        postArrays.push({...response[key], id:key})
      }
    }
    return postArrays;
    })
    ))
  }
   // error handling function
  private httpErrorHandler (error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
       console.error("A client side error occurs. The error message is " + error.message);
    } else {
       console.error(
          "An error happened in server. The HTTP status code is "  + error.status + " and the error returned is " + error.message);
    }

    return throwError("Error occurred. Pleas try again");
 }

  //send request to delete all posts
  deletePosts(){
    return this.http.delete("https://ng-new-httprequest-62cd9-default-rtdb.europe-west1.firebasedatabase.app/posts.json");
    }
  
}
