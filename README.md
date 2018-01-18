#Assistants personnels: Développer sa propre app

- [Introduction](#introduction)
- [La modélisation](#la-modélisation)
- [Les outils à disposition](#les-outils-à-disposition)
- [Démarrage du projet](#démarrage-du-projet)
- [Création des applications](#création-des-applications)
- [Connection des application à un service (API)](#connection-des-application-à-un-service-(API))
- [Test des applications](#test-des-applications)
- [Déploiement des applications](#déploiement-des-applications)

## Introduction
Que ce soit pour Alexa ou Google Assistant, la modélisation et la logique de développement est similaire. Les Skills d’Alexa et les applications de Google Assistant se différencient surtout par le vocabulaire utilisé par chacune des firmes et bien évidemment par leurs environnements de développement respectifs. Nous allons voir ici comment développer une petite application (Skills/Application) pour chacune des plateformes en question.
Au MEI nous possédons notre propre service météo qui nous retourne la température actuelle des différents bureau où nous travaillons. Ce service est accessible via une [API](https://office-temp.herokuapp.com/) public. Le but étant ici d’adapter ce service afin de pouvoir interroger Alexa et Google Assistant (via Google Home) via une Skills ou Application que l’on nommera Office Temp.
Dans une logique de simplification nous utiliserons le terme assistant pour désigner Alexa et Google Assistant. Nous utiliserons également le terme application (ou app) pour désigner les Skills et les applications Google Assistant. 

## La modélisation
Comme annoncé précédemment, la logique est la même pour chacune des plateformes. Pour notre application météo on peut donc partir sur l’idée suivante:
1. L’utilisateur annonce à l’assistant qu’il veut utiliser l’app Office Temp
2. L’assistant lui répond en lui demandant pour quelle pièce il souhaite avoir la température
3. L’utilisateur lui indique le nom de la pièce
4. L’assistant vérifie si le nom de la pièce est valide et répond comme suit:
  * Si la pièce est valide, donne la température et met fin à la conversation
  * Si la pièce n’est pas valide, demande à nouveau pour quelle pièce l’utilisateur veut la température

## Les outils à disposition
Pour chacune des plateformes il existe plusieurs manières de développer son application. 

### Chez Google
On a le choix de travailler avec Dialogflow, en se basant sur des templates prédéfinis ou encore en codant à l’aide de leur Actions SDK. Les templates prédéfinis permettent de créer des applications en quelques minutes sans aucune ligne de code. Toutefois cela se limite à des types d’applications bien définis: Trivia, Personnality Quiz, Flash Cards. Pour chacun des templates Google propose une marche à suivre. On configure son application en quelques clics puis on ajoute les données nécessaires (questions/réponses) à l’aide de Google SpreadSheets. 
Dialogflow, anciennement connu sous le nom de api.ai a été acquis et rebaptisé par Google il y a quelques mois. Ce service permet de créer des Actions capables de reconnaître et traiter le langage humain. En fonction des intentions utilisateurs détectées, on peut mettre en place une logique qui peut faire appel à des services (API) externes afin d'interagir et répondre. Pour notre app, nous avons fait le choix d’utiliser Dialoglflow car c’est l’outil qui nous semble être le plus intuitif et le plus simple à prendre en main pour bien débuter. 

### Chez Amazon
Amazon nous met à disposition son Alexa Skills Kit qui comme son nom l’indique est un répertoire d’outils dédiés à la création de Skills. A l’intérieur de celui-ci on retrouve un tas de choses permettant de configurer et de développer son application avec entre autre un Interaction Model qui permet de traiter les intentions utilisateurs un peu à la manière de Dialogflow.

## Démarrage du projet

### Chez Google
Pour utiliser l’environnement de développement il faut au préalable posséder un compte Google. La réalisation d’une application commence par la création d’un projet sur la plateforme [Action on Google](https://console.actions.google.com/u/0/). Un projet peut ensuite regrouper une ou plusieurs applications. Puisque nous avons fais le choix de bâtir notre application avec Dialogflow, au moment de la création du projet il faut cliquer sur le bouton BUILD de la carte Dialogflow puis cliquer sur le bouton Create actions on Dialogflow sur l’écran suivant. Ceci nous amène directement sur l’interface de Dialogflow que nous décrirons plus tard.

![Dialogflow](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/dialogflow-projects.png)

### Chez Amazon
Chez Amazon aussi il faut posséder un compte dédié afin d’accéder aux différents outils. Pour créer une Skill il faut se rendre dans le menu [Alexa de la Developer Console](https://developer.amazon.com/edw/home.html#/skills). On peut ensuite y ajouter une nouvelle Skill en cliquant Add a New Skill, ce qui nous amène directement à l’écran de paramétrage de notre nouvelle application.

![Alexa](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/amazon-projects.png)

## Création des applications

### Chez Google

Nous voilà maintenant sur l’interface Dialogflow qui va nous permettre de créer concrètement notre application. Après avoir choisi Dialogflow pour construire son app, on est automatiquement redirigé vers l’écran de création d’agent. Ce dernier représente notre future application, nous allons donc le nommer “OfficeTemp”. Pour information, un projet peut contenir plusieurs agent et donc plusieurs applications. L’étape suivante nous amène à la construction des différentes possibilité d’interaction de notre app avec l’utilisateur. Nous avions défini plus haut un modèle d’interactions que nous allons maintenant adapter à la plateforme. Comme pour un chatbot conventionnel, Dialogflow nous permet de définir une ou plusieurs intentions afin d’y répondre avec des actions (les actions Dialogflow n’ont aucun rapport avec les Actions de Google). Dans notre cas, la seule intention que peut exprimer un utilisateur consiste à connaître la température d’une pièce. 
Toutefois, par défaut, chaque application possède une Default Welcome intent qui représente son point d’entrée. Cette intention est en fait celle qui est invoquée par l’utilisateur lorsqu’il souhaite démarrer l’application. Dans les paramètres de cette intention ou retrouve l’events WELCOME. Cet events est là pour indiquer que la Default Welcome intent est l’intention de départ de notre application lorsque l’utilisateur prononcera Pour cela, il dira “Ok Google, talk to Office Temperature”. Nous avons ensuite la possibilité de définir une réponse à cette intention. Dans notre cas, nous souhaitons informer l’utilisateur qu’il peut demander la température d’une pièce en particulier. Nous allons donc répondre “For which room do you want the temperature?”.

![Dialogflow create step 1](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/dialogflow-create.png)

Ceci nous amène à création de notre seconde intention. Il s’agit ici d’analyser et traiter la réponse de l’utilisateur à la question précédente. Nous avons choisi de nommer cette intention get_room_temperature puisque nous essayons de déterminer la pièce pour laquelle l’utilisateur souhaite la température. Nous devons maintenant tenter de définir quelles sont les différentes manières que peut utiliser une personne pour annoncer la pièce. Ici nous avons définis deux possibilités “For the showroom” et “showroom”. 

![Dialogflow create step 2](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/dialogflow-create-2.png)

Pour chacune de ces phrases il faut ensuite déclarer à Dialogflow quel est le mot qui nous intéresse pour le déclarer comme entité (entity). Cette opération permet à Dialoglfow d’extraire et valider le paramètre qui nous intéresse afin de pouvoir le traiter correctement lors des étapes suivantes. Pour définir cette entité il faut double cliquer sur le mot en question afin qu'apparaisse une liste de type d’entités (entities).

![Dialogflow create step 3](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/dialogflow-create-3.png)

Les types par défaut (alphanumérique, booléen, email, etc.) ne nous seront pas utiles. Pour que nous puissions renvoyer la température correctement, nous devons définir notre entité comme une pièce appartenant à une liste de pièce prédéfinies. Pour cela, il faut cliquer sur “+ Create new” au bas de la liste. Sur l’écran suivant (Entities), il est possible de définir notre entité en lui donnant un nom (Rooms) et une liste de possibilités (Office, Showroom) ainsi que leurs synonymes.

![Dialogflow create step 4](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/dialogflow-create-4.png)

La grande partie du travail sur Dialogflow est maintenant terminée. Il ne reste maintenant plus qu’à câbler notre API météo avec notre agent OfficeTemp.

### Chez Amazon 

Lorsque l’on crée une Skill, on commence par lui donner un nom (name) pour l’identifier et un nom d’invocation (Invocation Name) pour la démarrer depuis Alexa. Comme avec Google, nous allons pouvoir maintenant définir les interactions possibles à l’aide de l’Interaction Model Builder.

![Alexa create step 1](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/alexa-create.png)

Nous allons créer ici l’intention qui nous permettra de déterminer la pièce demandée par l’utilisateur. Pour cela il faut créer une nouvelle Intents en cliquant sur “Add +”. Cette intention que nous avons choisi de nommer “OfficeTemperaure” regroupe toutes les possibilités (utterances) pour l’utilisateur d’interagir avec la Skill. Avec Alexa, l’utilisateur interrogera notre app de cette manière “Alexa, ask office temperature for the showroom” pour connaître la température du showroom. Le début de la phrase sert donc à lancer l’application tandis que la fin contient l’intention. Nous avons définit quelques possibilités (in the room, for the room). Pour chacune des ces possibilités, nous avons entouré le mot {room} d’accolades. En faisant cela, nous allons permettre à Alexa de valider et traiter différemment ce mot des autres pour y déceler le nom de la pièce. 

![Alexa create step 2](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/alexa-create-2.png)

Nous devons ensuite créer un slot qui représente le mot en question et lui attribuer un type. Comme nous l’avons fait auparavant avec Google, nous devons définir un type spécifique représentant nos pièces. Notre slot type rooms contient donc toutes les valeurs possibles et leurs synonymes.

![Alexa create step 3](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/alexa-create-3.png)

Pour terminer et valider tout ce que l’on vient de faire, il faut encore sauvegarder et construire le modèle à l’aide des boutons présents en haut de l’écran.

## Connection des applications à un service (API)

Jusqu’ici nous avons défini comment l’utilisateur peut interagir avec notre application et comment celle-ci analysera ce qui lui ai dit. Il nous reste toutefois à configurer notre app pour que celle-ci réponde avec la bonne information. Pour cela nous allons connecter notre application à notre API en ligne. Actuellement celle-ci répond simplement avec du JSON lorsqu’un utilisateur ou une application tiers l’interrogent. Nous allons devoir modifier un peu notre code (Node.js) pour qu’il réponde aux exigences de nos deux plateformes en matière de réponse. On ne va entrer en détails dans les spécificités de notre code mais plutôt décrire les points importants de celui-ci.

### Chez Google

Pour être compatible avec l’eco-système Google Assistant, notre API doit être accessible via HTTPS. La première chose à faire est de définir l’URL qui permet de retourner la température d’une pièce dans la section Webhook du menu Fulfillment de Dialogflow. Ceci permet de faire le lien entre la case que nous avions cochée précédemment pour notre intention get_temperature_room. 

![Dialogflow connect](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/dialogflow-connect.png)

Grâce à cela, à chaque fois que Dialogflow déterminera que l’utilisateur invoque l’intention get_temperature_room, une requête (POST) sera envoyée vers notre API qui retournera alors la réponse au format souhaité. Pour traiter simplement la requête envoyée par Dialogflow nous avons utilisé la classe DialogflowApp de la librairie actions-on-google.
Notre code est assez simpliste et vous trouverez plus de détails dans les commentaires. Dans un premier temps nous récupérons le paramètre room envoyer par Dialogflow. Nous appelons ensuite l’URL du thermomètre en question. Puis nous parsons la réponse et la retournons au format Dialogflow.

### Chez Amazon

Tout comme Google, Amazon impose d’utiliser des URL sécurisée (HTTPS). Cette dernière est paramétrée dans l’écran Configuration de notre Skill.

![Dialogflow connect](https://github.com/MediaComem/amazon-alexa-google-assistant/blob/master/doc/alexa-connect.png)

Tout comme pour Dialogflow, il existe des librairies pour simplifier le traitement des requêtes envoyées par Alexa. Toutefois nous avons fait le choix ici de faire sans afin de comprendre un peu mieux ce qu’il se passait en coulisse. 
La première chose à faire lorsque l’on reçoit une requête (POST) d’Alexa, c’est l’analyse du type de requête et de l’état du dialogue. Ces informations sont envoyées vers l’API par Alexa afin d’informer de l’état de la conversation à chaque fois que l’utilisateur interagit avec notre Skill. Si l’utilisateur démarre la conversation avec notre Skill sans spécifier une pièce, alors Alexa postera une requête vers notre API qui contiendra un type lauchRequest. On peut à ce moment là choisir de répondre par le message que l’on souhaite. Dans notre cas nous avons décidé de répondre simplement par un message de bienvenue et en indiquant qu’il faut préciser le nom d’une pièce pour obtenir la température.
Si l’utilisateur le fait, alors Alexa envoie une requête de type intent contenant le nom de la pièce (slot). Ces informations permettent alors à l’API de générer la réponse appropriée.

## Test des applications

### Chez Google

Il existe deux solutions simples de tester notre application. La première possibilité consiste à utiliser le simulator Google Assistant. Ce simulateur est accessible depuis le menu Integrations  de Dialogflow en cliquant ensuite sur la carte Google Assistant. On peut ensuite simplement tester notre application en parlant au micro de notre ordinateur ou en écrivant nos demandes dans le champs prévu. Ce simulateur offre l’avantage d’avoir une vue sur ce que Google Assistant envoi et réceptionne comme requêtes.
La deuxième possibilité consiste à utiliser n’importe quelle périphérique compatible Google Assistant connecté au compte Google utilisé pour le développement de l’app. Si vous possédez un Google Home, alors il vous suffit de lui demander “Ok Google, Talk to my test app” pour que celui démarre votre application.

### Chez Amazon
L’interface de configuration de Skills Alexa offre un menu test qui permet d’envoyer des requêtes de types textes afin de tester une Skill. Toutefois il est actuellement impossible de tester une Skill custom comme celle que nous avons développé ici. Pour tester notre Skill, il faut donc utiliser un périphérique disposant d’Alexa comme Echo et que celui-ci soit connecté au même compte Amazon que celui utilisé pour le développement de la Skill.

## Déploiement des applications

Les applications développées pour Alexa et Google Assistant doivent suivre un processus de review strict avant d’être rendues publics.













