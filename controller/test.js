// user is not logged in get all items
// var query = SwapModel.ItemModel.find({}).select({"catalogCategory":1})


<form>
<table class="table table-hover" >
    <thead>
    <tr>
    <th scope="col"></th>
    <th scope="col">Book Name</th>
<th scope="col">Book Id</th>

</tr>
</thead>
<tbody>
<% for(var i=0; i< data.items.length; i++){
%>

<tr>
    <th scope="row">
        <input type="radio" name="selectedBook" value="<%= data.items[i]._id %>">
    </th>
    <td><%= data.items[i].bookName %></td>
    <td><%= data.items[i]._id %></td>
        </tr>
        <% } %>
</tbody>
</table>
</form>
    
    
    .a-link{
    color:#258ffc;
    
}
.a-link:hover {
    color:#258ffc;
    text-decoration: underline;
}

{ items: {},
    title: 'My Swaps',
        loginFlag: true,
    theUser:
    { city: 'Charlotte',
        state: 'NC',
        postCode: '28262',
        country: 'USA',
        _id: '5bdb9f85f83d6a39dcfcc523',
        firstName: 'Ron',
        lastName: 'King',
        email: 'ron.king@gmail.com',
        address1: '9876 University Terrace',
        address2: 'Apartment N',
        password: 'test123' },
    docs:
    { city: 'Charlotte',
        state: 'NC',
        postCode: '28262',
        country: 'USA',
        _id: '5bdb9f85f83d6a39dcfcc523',
        firstName: 'Ron',
        lastName: 'King',
        email: 'ron.king@gmail.com',
        address1: '9876 University Terrace',
        address2: 'Apartment N',
        password: 'test123' },
    userRequestedSwaps:
        [ { _id: 5be61e9a0ad1374b5f8316da,
            userId: '5bdb9f85f83d6a39dcfcc523',
            itemCodeOwn: '5bdcc9bf0fb80748ecaccff6',
            itemCodeWant: '5bdd392394e4f5541e158e6a',
            itemUserId: '5bdd31bbd5d92353ca8bc7ef',
            itemStatus: 'pending',
            __v: 0 } ],
            othersRequestedSwaps: [] }
userRequestedSwaps =  [
    {
        offerId
        userItem
        otherItem
    }
]

otherRqSwapsTemp = [
    {
        offetId:'',
        userItem:{},
        otherItem:{},
        offerStatus:''
    }
]

