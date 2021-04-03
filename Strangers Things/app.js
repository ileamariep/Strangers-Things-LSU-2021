const BASE_URL = `https://strangers-things.herokuapp.com/api/2101-LSU-RM-WEB-PT`

let myToken = JSON.parse(localStorage.getItem('token'))




async function allPostsAtState () {
 
  
    try {
    const posts = await fetchPosts();
  
      posts.forEach((post) => {
        const postHTML = createPostHTML(post); 
        $(".post-container").append(postHTML);
      });

      return posts;

    } catch (error) {
      console.log(error)
    }
  
}

allPostsAtState()

async function useMyData () {
  const posts = await fetchPosts();
  const myData = await fetchMyData()
  let myUserName = myData.username
      console.log(myUserName, 'this is my username')
      let cardData = $('.cards').data('data')
      let cardDataName = cardData.author.username
      console.log(cardDataName, 'is this the author name')

}

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
        <div class='post_price_back'><p>Price: ${post.price}</p></div>
            <div class='post_desc_back'><p>${post.description}</p></div>
            <div class="posted_by">
                <span> Login/Register to Message Seller </span>
            </div>
        </div>
    </div>
    </div>
  `).data('data', post))
};

async function getUserToken (userNameVal, userPassVal) {
  
  try {
        const response = await fetch (`${BASE_URL}/users/register`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: {
                username: `${userNameVal}`,
                password: `${userPassVal}`,
              }
            })
        })
    
        const {data, token} = await response.json();
        localStorage.setItem('token',JSON.stringify(data.token));
        window.location.href='signedIn.html';
        return token
       } catch (error) {
           console.log(error)
           $(".reg-error").text('User already exists')
       }

}

$('#register-form').on('submit', function (event) {
  event.preventDefault();

  let userVal = $('#user-name').val()
  let userPass = $('#user-password').val()
  getUserToken (userVal, userPass)

  $('.activeName').text(`hello ${userVal}`)

  modal.style.display = "none";
  
  $('#register-form').trigger('reset')
})

async function userLoggedIn (userNameVal, userPassVal) {
 
    try {
        const response = await fetch (`${BASE_URL}/users/login`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: {
                username: `${userNameVal}`,
                password: `${userPassVal}`,
              }
            })
        })
    
        const {data} = await response.json();
        localStorage.setItem('token',JSON.stringify(data.token))
        window.location.href='signedIn.html';
        return data
       } catch (error) {
           console.log(error)
           $(".login-error").text('Invalid Username or Password')
       }
  }



$('#login-form').on('submit', function (event) {
    
    event.preventDefault();


    let userVal = $('#log-user-name').val()
    let userPass = $('#log-user-password').val()
    
    userLoggedIn (userVal, userPass)
    $('#login-form').trigger('reset')
    modal.style.display = "none";
    
   

})

$('.log-out-button').on('click', function () {
  localStorage.removeItem("token");
})

// REGISTRATION MODAL
const modalReg = document.getElementById("myModalReg");
const btnReg = document.getElementById("myBtnReg");
const spanReg = document.getElementsByClassName("closeReg")[0];

btnReg.onclick = function() {
  modalReg.style.display = "block";
}

spanReg.onclick = function() {
  modalReg.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modalReg) {
    modalReg.style.display = "none";
  }
}


// LOGIN MODAL
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

$("#myInput").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $(".cards").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});
