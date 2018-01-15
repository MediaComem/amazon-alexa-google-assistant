# Introduction
Que ce soit pour Alexa ou Google Assistant, la modélisation et la logique de développement est similaire. Les Skills d’Alexa et les applications de Google Assistant se différencient surtout par le vocabulaire utilisé par chacune des firmes et bien évidemment par leurs environnements de développement respectifs. Nous allons voir ici comment développer une petite application (Skills/Application) pour chacune des plateformes en question.
Au MEI nous possédons notre propre service météo qui nous retourne la température actuelle des différents bureau où nous travaillons. Ce service est accessible via une (https://office-temp.herokuapp.com/)[API] public. Le but étant ici d’adapter ce service afin de pouvoir interroger Alexa et Google Assistant (via Google Home) via une Skills ou Application que l’on nommera Office Temp.
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

## Démarrer le projet

### Chez Google
Pour utiliser l’environnement de développement il faut au préalable posséder un compte Google. La réalisation d’une application commence par la création d’un projet sur la plateforme Action on Google. Un projet peut ensuite regrouper une ou plusieurs applications. Puisque nous avons fais le choix de bâtir notre application avec Dialogflow, au moment de la création du projet il faut cliquer sur le bouton BUILD de la carte Dialogflow puis cliquer sur le bouton Create actions on Dialogflow sur l’écran suivant. Ceci nous amène directement sur l’interface de Dialogflow que nous décrirons plus tard.

![Dialogflow][doc/dialogflow-projects.png]