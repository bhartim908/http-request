import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PostsService } from './posts.service';
import { Post } from './post.model';
import { filter, map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{

@ViewChild('postForm', { static: false }) postForm : NgForm | any;

title = "Responsive Form Template"
loadedPosts:Post[]= [];
isFetching =false;

constructor(private postService:PostsService){}

ngOnInit(): void {
  //when page loaded, data wil be fetched..otherwisw no data available will be displayed and when clikc on btn, data fetch will happen
this.isFetching=true
  this.postService.fetchPosts().subscribe(posts =>{
  this.loadedPosts=posts;
 this.isFetching=false;
  })

}

//get data from form when submit 
onCreatePost(data: { title: string; content: string; }) {
  this.postService.createAndStorePosts(data);
  }

//fetch data from database
onFetchPosts() {
  this.isFetching=true
  this.postService.fetchPosts().subscribe(posts =>{

  //must make it false cuz in template we have condition !isFetching -> it is true loading displayed then go to list,
  // if !isFectching is false, then conditions in <p> and <ul> wont satisfy and content and title will no displayed

  this.loadedPosts=posts;
  this.isFetching=false;
  console.log(this.loadedPosts)
})
}

 //clear all posts
 onClearPosts() {
  this.postService.deletePosts().subscribe( () =>
   { 
   this.loadedPosts = [];
  })
 }

  //clear last index posts-> clear one post at a time when clicked..that post is last index's post
  onClearPost(){
    this.postService.deletePosts().subscribe(() =>
    {
      //pop remove last index element and updates on its own.
      this.loadedPosts.pop();
      console.log(this.loadedPosts);
    }
    )
  }
  
  //reset form
  resetForm() : void {
    this.postForm.reset();
  }


  }

  