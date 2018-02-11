[Documentation](https://documenter.getpostman.com/view/2206404/nano-alias/RVfsFYHj) | [Discord](https://discord.gg/ecVcJM3)

# The Problem
Sending Nano or any cryptocurrency is not as easy as sending Fiat through an app like Venmo, Swish, or Square Cash. One of the main issues that causes this pain is that you must know your friends address. Solutions such as QR codes work great when you are in person or are able to upload one to a screen but that requires both parties to meetup or share a QR code.

# Nano Alias
Nano Alias allows you to register an alias for your Nano address in two supported formats.

1. Alias Handle: This is similar to a twitter handle and must start with a unicode letter, must only container unicode letters and numbers, and must be at least 3 characters.
2. Alias Number: Phone number in E164 format.

# Security
When designing and building Nano Alias a lot of questions were brought up on how to make it as secure as possible. We made efforts to ensure that all data that enters our system is either hashed (SHA256) or encrypted (AES-256). If our database was hacked no personal information including phone numbers and emails would be leaked. The biggest concern of this system at the moment is the fact it is a centralized third-party application.

##### Squatting
Squatting is one of the primary concerns that everyone has with Nano Alias. When it comes to registering a phone number alias you will be sent an SMS to verify you are the owner of that phone number. Standard aliases don't have any verification method so if someone takes the @amazon alias what is the process of giving that back to the proper entity? This is where being a centralized application has an advantage. We will create a ticketing system where people can request to take their aliases back from squatters. The guidelines of what constitutes **your** alias are still being developed but we are leaning towards trademarked companies. Who will make the final call on if an aliases is reassigned? We are looking to form a committee that will be comprised of members from different wallets, services, merchants, and core team members that will vote on the reassignment of aliases.

##### Privacy & Verification
When publishing your alias you have an option called listed. Listed means that people will be able to search for your alias using our search API. This can be helpful if you want people to be able to see your alias in a typeahead UI. When marked as unlisted people will only be able to find you if they know your entire alias. All phone number aliases are unlisted and hashed in the database for security reasons. Additionally, we have implemented a feature similar to twitters verification that will allow us to verify aliases that belong to prominent businesses or people.

##### Editing
When you create an alias you are given a seed that will allow you to edit your address, email, or event change your alias. Any time you edit or create an alias an avatar is generated. This will act as a visual representation so that everytime you send Nano to an alias the avatar shouldn't have changed and if it has then that means the the user has edited the recieving address and you should be sure it is going to the right location.

![Example Avatar](https://i.imgur.com/QCaKh4f.png
 "Example Avatar")

# Integrating & Contributing to Nano Alias
If you are intersted in integrating Nano Alias into your application see our documentation here: [Documentation](https://documenter.getpostman.com/view/2206404/nano-alias/RVfsFYHj)

If you are interested in contributing to Nano Alias you are welcome to on our [github](https://github.com/Stormtv/nano-alias)

# Roadmap
Being the first Alpha release of this software our number one priority is security. We are launching the alpha with hopes that we will find any possible mistakes before starting a production service.

##### Future Features
* Building a front-end web application for managing and creating Aliases
* Implementing a payment system to cover the costs of SMS verification. Currently we are covering the costs of sending the verification text messages. If you like what we are building here at canoe you can donate below!
* Better Error Handling
* Better documentation the existing documentation is not detailed enough
* Add Descriptions and Locations so people can find and support vendors that are using Nano Alias

# Conclusion
Our goal here at Canoe is to make using Nano easier than using Fiat. Nano alias is one of many solutions that will help make that vision a reality. We have open sourced this system in the hopes that it will be adopted by the community with the goal of making this a universal standard. We are already working with other teams on integrating Nano Alias into their software as well.

If you have questions or feedback you can always reach us on our [discord server](https://discord.gg/ecVcJM3).

Thank you, the Canoe team.
