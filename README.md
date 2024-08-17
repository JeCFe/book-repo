<div align="center">
<img width="200" alt="Book Repo logo" src="https://github.com/JeCFe/book-repo/assets/38367384/225023c4-8d80-4a84-9a88-18402563fa19">
</div>

# The Book Repository

A service to allow for the visualisation and management of you physical bookshelf in the digital world. Persistant user storage and secure user accounts with Auth0 being the authentication provider. Deploying to Azure Container Registries / Apps, using OpenLibrary public APIs for inital data injection when searching for book. Caching the book data onto Azure SQL Server and the book covers onto Azure Blob Storage. 

## Features

- Ability to create and manage user account (following GDPR principles)
- Create and manage numourous bookshelves
- Add books to these bookshelves with unique ordering per shelf
- Ability to add books by ISBN and fuzzy searching
- Allow to rate books
- Allow to add comments onto books


## Roadmap

- Shareable uneditable links to bookshelves / account
- Favourite / "Wish list" book from a shareable link
- Allow importing library from Good Read
- Set reading goals 
- Be able to see a global catalogue of book other customers use with averaged reviews and anonymous reviews
- Add books into a series and filter by series 
- Add different filtering per bookshelf 
- AI driven book recommendations based of what's in your bookshelf or what has been recently read  
- Be able to raise errors with the book data / cover
- Admin portal to allow the management of users and errors raised about books
- Split out the user self service into a dedicated service and app so it's reusable by other apps in the future
- Trophy / achievements that display on user profiles, and are shareable on the shared pages


## Third Party Providers

Azure -> used for deployments, SQL servers, and blob storage 

Auth0 -> used as authentication provider 

OpenLibrary -> used to get book data and book covers
