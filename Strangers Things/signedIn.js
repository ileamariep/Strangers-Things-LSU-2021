const BASE_URL = `https://strangers-things.herokuapp.com/api/2101-LSU-RM-WEB-PT`

let myToken = JSON.parse(localStorage.getItem('token'))

 function tokenIsThere() {
   return localStorage.getItem('token')
  }

  


async function allPostsAtState () {
  
    try {
    const posts = await fetchPosts();
 
      posts.forEach((post) => {
        const postHTML = createPostHTML(post);

        if(post.isAuthor) {
          let yourContainer = $(".your-post-container");
          yourContainer.append(postHTML);
          $('#yourThings .post_actions').html(`
          <button class='delete-my-post'>DELETE</button>
            `)
        } else if (!post.isAuthor) {
          $(".post-container").append(postHTML);
          $('#forSale .post_actions').html(`
          <form class='message-form'>
            <lablel>Message</lablel><br >
            <input required type='text' placeholder='Message' class='userMessageContent'><br >
            <button type='click' class='messageSubmit'>SUBMIT</button>
          </form>
            `)
        }

      });

      return posts;

    } catch (error) {
      console.log(error)
    }

}

allPostsAtState()

async function myPostsState () {

  
  try {
    const posts = await fetchMyData();
    let postArr = await posts.posts
    let messageArr = await posts.messages
    console.log(messageArr, 'these should be my messages')
    console.log(postArr, 'these should be my posts')
  
/// this goes through the messages

     for (let i = 0; i < messageArr.length; i++) {
      let theMessages = messageArr[i]
      let createMyMessages = createMessageHTML(theMessages);
      $(".message-container").prepend(createMyMessages);
     }

     $('.userNameHead').text(`Hi, ${posts.username}!`)
    

      return posts;

    } catch (error) {
      console.log(error)
    }
}

myPostsState ()

// const createMyPostHTML = (posts) => {
// 	return ($(`
//       <div class="cards">
//       <div class="flip-card-inner">
//         <div class='card_front'>
//             <div class='post_header'><p>${posts.title}</p></div>
//             <div class='post_price'><p>${posts.price}</p></div>
//             <div class='post_active_front'><p>Is Active? ${posts.active}</p></div>
//         </div>
//         <div class='card_back'>  
//         <div class='post_header_back'><p>${posts.title}</p></div>
//         <div class='post_price_back'><p>${posts.price}</p></div>
//             <div class='post_desc_back'><p>${posts.description}</p></div>
//             <div class='post_active_back'><p>Is Active? ${posts.active}</p></div>
//             <div class='post_actions'>
//                 <button class='delete-my-post'>DELETE</button>
//                 <button class='edit-my-post'>EDIT</button>
//             </div>
//         </div>
//     </div>
//     </div>
//   `).data('posts', posts))
// };

async function fetchMyData () {
 try {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${myToken}`
    },
  })

  const {data} = await response.json();
  console.log(data, 'data from fetch my data')
  return data; 

 } catch(error) {
  console.error(error)
 }

}

async function fetchPosts () {

  try {
    
    const response = await fetch(`${BASE_URL}/posts`, myToken ?  {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${myToken}`
    }
  } : {});
   
    const {data} = await response.json();
    
    return data.posts.reverse()

  } catch (error) {
    console.log(error)
  }
}

const createPostHTML = (post) => {
	return ($(`
            <div class="cards">
            <div class="flip-card-inner">
              <div class='card_front'>
                  <div class='post_header'><p>${post.title}</p></div>
                  <div class='post_price'><p>${post.price}</p></div>
                  <div class="posted_by">
                      <span>User ${post.author.username}</span>
                  </div>
              </div>
              
              <div class='card_back'>  
                <div class='post_header_back'><p>${post.title}</p></div>
                <div class='post_price_back'><p>${post.price}</p></div>
                <div class='post_desc_back'><p>${post.description}</p></div>
                <div class='post_actions'>
                
              </div>
          </div>
          </div>
  `).data('data', post))
};


async function userCreatePost(postObj) {

  try {
    const response = await fetch(`${BASE_URL}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myToken}`
          },
          body: JSON.stringify(postObj)
        })

      const newPost = await response.json();
      return newPost

  } catch (error) {
    console.log(error)
  }
}

$('.post-submit').on('click', async function (event) {
  event.preventDefault();
  
  
  const postData =  {
    post: {
      title: $('#post-title').val(),
      description: $('#post-description').val(),
      price: $('#price').val(),
      location: $('#location').val(),
      willDeliver: false,
      }
    }
    try { 
      const newPost = await userCreatePost(postData)
      const newCreatedPost =  createPostHTML(newPost.data.post)
      $(".your-post-container").prepend(newCreatedPost)
      $('#yourThings .post_actions').html(`
          <button class='delete-my-post'>DELETE</button>
            `)
      $('#post-form').trigger('reset')
      

  } catch (error) {
      console.error(error)
  }
  
})

async function deletePost (postId) {
 
  try {
      const response = await fetch(`${BASE_URL}/posts/${postId}`, {
          //config object
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myToken}`
          },
      })

      const {data} = await response.json();
      return data; 
  } catch (error) {
      throw error;
  }
}


$(".your-post-container, .post-container").on("click", '.delete-my-post', async function () {
  const postElement = $(this).closest('.cards');
  console.log(postElement)
  const posts = postElement.data('data');
  console.log(posts, 'this is the data from the post')
  try {
      const result = await deletePost(posts._id)
       $(postElement).slideUp()
  }catch (error) {
      console.error(error)
  }

});

$('.log-out-button').on('click', function () {
  localStorage.removeItem("token");
  window.location.href='index.html';
  logOutUserClasses ();
})

function openType(evt, type) {
  let i, tabcontent, tablinks;
  tabcontent = $(".tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = $(".tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(type).style.display = "block";
  evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();

$("#myInput").on("keyup", function() {
    let value = $(this).val().toLowerCase();
    $(".cards").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });



  async function fetchMessages (postId, messageContent) {
 
    try {
        const response = await fetch(`${BASE_URL}/posts/${postId}/messages`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myToken}`,
          },
          body: JSON.stringify(messageContent),
        })
  
        const {data} = await response.json();
        return data.user; 
    } catch (error) {
        throw error;
    }
  }

  // const createMessageHTML = (user) => {
  //   return ($(`
  //       <div class="message-cards">
  //       <div class='myMessageTitle'>Post Title: ${user.messages.post.title}</div>
  //         <div class='myMessage'>The Message: ${user.messages.content}</div>
  //         <div class='myMessageId'>From: ${user.messages.fromUser.username}</div>
  //       </div>
  //   `).data('data', user))
  // };

  const createMessageHTML = (messages) => {
    return ($(`
        <div class="message-cards">
        <div class='myMessageTitle'>Post Title: ${messages.post.title}</div>
          <div class='myMessage'>The Message: ${messages.content}</div>
          <div class='myMessageId'>From: ${messages.fromUser.username}</div>
        </div>
    `).data('data', messages))
  };

  

  $('.post-container').on('click', '.messageSubmit', async function (event) {
    event.preventDefault();
    
    const postElement = $(this).closest('.cards');
    console.log(postElement, 'this is from $this closest card')
    let myContent = postElement.find('input[type="text"]').val()
    console.log(myContent, 'from my .val() form')
    const myMessage = postElement.data('data');
    console.log(myMessage, 'this is the post data' )
    const myPostId = myMessage._id
    console.log(myPostId, 'this is the post id' )

    $(postElement).find('.message-form').trigger('reset')
    
     
    const messageData =  {
   
          message: {
            content: myContent,
          }
    }
      
      try { 
        const newMessages = await fetchMessages(myPostId, messageData)
        const newCreatedMessage =  await createMessageHTML(messageData.user.messages)
        console.log(newCreatedMessage, 'this is the new created message')
      
        
       
  
    } catch (error) {
        console.error(error)
    }
    
  })

