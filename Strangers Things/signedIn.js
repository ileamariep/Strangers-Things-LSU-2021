const BASE_URL = `https://strangers-things.herokuapp.com/api/2101-LSU-RM-WEB-PT`

let myToken = JSON.parse(localStorage.getItem('token'))

 function tokenIsThere() {
   return localStorage.getItem('token')
  }

  function loggedInUserClasses () {
    $('.edit').addClass('isUser').removeClass('notUser')
    $('.delete').addClass('isUser').removeClass('notUser')
  }


async function allPostsAtState () {
  
    try {
    const posts = await fetchPosts();
 
      posts.forEach((post) => {
        const postHTML = createPostHTML(post);
        $(".post-container").append(postHTML);
          if (post.isAuthor === true) {
            console.log(post.isAuthor, 'this is the is author')
            $(".post_actions").children('.message').addClass('notUser')
          } else {
            $(".post_actions").children('.message').removeClass('notUser')
          }

      });

      return posts;

    } catch (error) {
      console.log(error)
    }

}

allPostsAtState()
;
async function myPostsState () {

  
  try {
    const posts = await fetchMyData();
    let postArr = await posts.posts
     for (let i = 0; i < postArr.length; i++) {
      let thePosts = postArr[i]
      let createMyPosts = createMyPostHTML(thePosts);
      if (thePosts.active === false) {
        console.log(thePosts.active, 'this is the is active posts')
        $(".your-post-container").children('.cards').addClass('notUser')
      }
      $(".your-post-container").prepend(createMyPosts);
     

     }

     $('.userNameHead').text(`Hi, ${posts.username}!`)
     loggedInUserClasses ()

      return posts;

    } catch (error) {
      console.log(error)
    }
}

myPostsState ()

const createMyPostHTML = (posts) => {
	return ($(`
      <div class="cards">
      <div class="flip-card-inner">
        <div class='card_front'>
            <div class='post_header'><p>${posts.title}</p></div>
            <div class='post_price'><p>${posts.price}</p></div>
        </div>
        <div class='card_back'>  
        <div class='post_header_back'><p>${posts.title}</p></div>
        <div class='post_price_back'><p>${posts.price}</p></div>
            <div class='post_desc_back'><p>${posts.description}</p></div>
            <div class='post_actions'>
                <button class='delete-my-post'>DELETE</button>
                <button class='edit-my-post'>EDIT</button>
            </div>
        </div>
    </div>
    </div>
  `).data('posts', posts))
};

async function fetchMyData () {
 try {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${myToken}`
    },
  })

  const {data} = await response.json();
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
    
    return data.posts

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
          <div>
          <form class='message-form'>
              <h3>MESSAGE</h3>
              <lablel>Name</lablel><br >
              <input required type='text' placeholder='Name' class='userMessagenName'><br >
              <label>Your Message</label><br >
              <input required type='text' placeholder='Message' class='userMessageContent'><br >
              <button type='submit' class='messageSubmit'>SUBMIT</button>
            </form>
          </div>
        </div>
    </div>
    </div>
  `).data('data', post,))
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
      price: '200',
      location: 'Lafayette',
      willDeliver: false,
      }
    }
    try { 
      const newPost = await userCreatePost(postData)
      const newCreatedPost =  createPostHTML(newPost.data.post)
      $(".post-container").prepend(newCreatedPost)

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


$(".your-post-container").on("click", '.delete-my-post', async function () {
  const postElement = $(this).closest('.cards');
  const posts = postElement.data('posts');
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



