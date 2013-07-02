$(document).ready(populateExistingComments);

var user = function(name,description,image){
	/* user object constructor */
	this.name=name;
	this.description=description;
	this.image=image;
}

function populateExistingComments(){	
	/* 
	 * if we were using server-side functionality, this is where we would make an 
	 * ajax get request to the database to populate the existing comments. In this 
	 * case, we'll set up dummy users and dummy comments to serve the same purpose. 
	 */
	
	var existing_user_1 = new user('Michael Jordan', 'Wears a lot of Nike shoes', 'images/user-img-1.png');
	var existing_user_2 = new user('Michael Jordan', 'Developer at Foursquare', 'images/user-img-1.png');
	var existing_user_3 = new user('Michael Jordan', 'Product Designer', 'images/user-img-1.png');
	
	var existing_comment_1 = addComment(existing_user_1, null, 'Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget.', '2 minutes ago');
	var existing_comment_2 = addComment(existing_user_2, existing_comment_1, 'Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget.', '2 hours ago');
	var existing_comment_3 = addComment(existing_user_3, existing_comment_1, 'Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget.', '2 hours ago');
	var existing_comment_4 = addComment(existing_user_2, existing_comment_3, 'Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget.', '2 hours ago');
}

function getCurrentUser(){
	/*
	 * if we were using server-side functionality, this data would already be
	 * stored as login info, but in this case we'll set up a dummy user
	 */
	return new user('Emily Maskin', 'Front-End Developer', 'images/user-img-2.png');	
}

function buildComment(user,parent_comment,message,time){
	
	/* Create html snippet that will become the comment */
	var new_comment = $('<div class="section'+(parent_comment ? ' subsection' : ' top_comment')+'" />');
	new_comment.append('<div class="user_image"><div class="gray_line"></div><div class="thumbnail"><img src="'+user.image+'" alt="'+user.name+'"></div></div>');
	var text = $('<div class="text"/>');
	new_comment.append(text);
	text.append('<p class="user_info"><span class="name">'+user.name+'</span><span class="description">'+user.description+'</span><span class="delete"></span></p>');
	text.append('<p class="user_comment">'+message+'</p>');
	text.append('<p class="comment_info"><span class="time">'+(time ? time : 'Just now')+'</span><span class="divider">&#183;</span><a class="reply" href="javascript:void(0)">Reply</a></p>');

	/* set up event handler for replying to a comment */
	new_comment.find('.reply').on('click',function(){
		if(!new_comment.find('.new_comment_box').length){
			addCommentField(getCurrentUser(),new_comment);
		}
	});
	
	/*set up event handler for deleting a comment */
	var delete_icon = new_comment.find('.delete');
	new_comment.find('.text').mouseenter(function(){
		delete_icon.show();
	}).mouseleave(function(){
		delete_icon.hide();
	});
	delete_icon.on('click',function(){
		deleteComment(new_comment);
	});
	
	return new_comment;
}

function addComment(user,parent_comment,message,time){
	/* Add new comment to the page */
	$('.new_comment_box').remove();
	var new_comment = buildComment(user,parent_comment,message,time);
	if(!parent_comment){
		parent_comment = $('.wrapper');
	}
	if(saveComment(new_comment,parent_comment)){
		appendNew(new_comment,parent_comment);
	}
	return new_comment;
}

function buildCommentField(user,comment_to_add_to){

	/* Create html snippet that will become a new comment field */
	var new_comment_box = $('<div class="new_comment_box"/>');
	$(new_comment_box).append('<img class="new_user_image" src="'+user.image+'" alt="'+user.name+'" />');
	$(new_comment_box).append($('<div class="comment_area"><input placeholder="Post your reply..." /></div>'));
	$(new_comment_box).append($('<button class="post" type="button">Post</button>'));
	
	/* set up event handler for submitting a comment */
	var post = $(new_comment_box).find('.post');
	var textbox = $(new_comment_box).find('.comment_area input');
	post.on('click',function(){
		message = textbox.val();
		addComment(getCurrentUser(),comment_to_add_to,message);
	});
	textbox.on('keypress',function(e){
		if(e.which == 13){
			post.click();
		}
	});
	
	return new_comment_box;
}

function addCommentField(user,comment_to_add_to){
	/* Add new comment field to the page */
	$('.new_comment_box').remove();
	var new_comment_box = buildCommentField(user,comment_to_add_to);
	appendNew(new_comment_box,comment_to_add_to);
	new_comment_box.find('input').focus();
}

function appendNew(child,parent){
	/* add a new element to the appropriate spot in the comment flow */
	var left_margin = parseInt(parent.find('.user_image').eq(0).css('width')) + 15;
	child.css('margin-left',left_margin);
	var most_recent_comment = parent.find('.subsection').eq(0);
	if(most_recent_comment.length){
		most_recent_comment.before(child);
	}
	else{
		parent.append(child);
	}
}

function saveComment(comment,parent_comment){
	/*
	 * if we were using server-side functionality, here is where an ajax post 
	 * request would be made to a php file that would in turn save the new 
	 * comment, including which comment it is in response to, to a database.
	 * 
	 * Alternatively the comment box could be part of a form, but in 
	 * that case submitting a comment would cause the page to reload.
	 */
	
	//if successful
	return true;
	//else return false
}

function deleteComment(comment){
	/*
	 * if we were using server-side functionality, here is where an ajax request would 
	 * be made to a php file that would delete the new comment (and any descendants).
	 */	
	 
	 //on success of ajax call:
	 comment.remove();
}