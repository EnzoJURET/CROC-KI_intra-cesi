var amis = [];
var promotion = [];

$( document ).ready(function() {
    containerInit();
    $("#barreEnvoiMessage").focus();

    keyEnterListenerOnMessageInput();

    recupererAmisEtPromotion();

    recupererGroupes();


    setInterval(function(){ recupererAmisEtPromotion(); }, 10000);
    
});

function recupererGroupes()
{
    $idUtilisateur = getCookie("id");
    $.ajax({
        cache : false,
        url : "../data/getSomething",
        type : "POST",
        async:false,
        data: ({
            clef:'groupes',
            idUser: $idUtilisateur
       }),

        success : function(retVal, statut){
            $groupes = JSON.parse(retVal);
            console.log($groupes);

            document.getElementById("conteneurGroupePrive").innerHTML = "";
            document.getElementById("conteneurGroupePublic").innerHTML = "";
            for(var i = 0 ; i < $groupes.length ; i++)
            {
                if($groupes[i].status == 1) // privé
                {
                    document.getElementById("conteneurGroupePrive").innerHTML += "<div id='ligneGroupe"+$groupes[i].id+"' class='ligneGroupe' title='"+$groupes[i].description+"' >"+$groupes[i].nom_groupe+"</div><br/>";
                }
                else { // = 0 donc public

                }
            }

        },
 
        error : function(retVal, statut, erreur){
        }
     });
}

function recupererAmisEtPromotion()
{
    $idUtilisateur = getCookie("id");
    $promotion = getCookie("promotion_personne");
    var donnees = [];
    $.ajax({
        cache : false,
        url : "../data/getSomething",
        type : "POST",
        async:false,
        data: ({
            clef:'amisEtPromotion',
            idUser: $idUtilisateur,
            promotionUser: $promotion
       }),

        success : function(retVal, statut){
            $donnees = JSON.parse(retVal);           
            //console.log($donnees);
            amis = $donnees["amis"];
            promotion = $donnees["promotion"];

            afficherAmis();
            afficherDemandesAmi();
            afficherPromotion();
            $(".labelConnaissance").mouseenter(openPersonTooltipAmi).mouseleave(closePersonTooltipAmi);


        },
 
        error : function(retVal, statut, erreur){
 
        }
     });
}

function afficherDemandesAmi()
{
    $idUtilisateur = getCookie("id");
    $promotion = getCookie("promotion_personne");
    var donnees = [];
    $.ajax({
        cache : false,
        url : "../data/getSomething",
        type : "POST",
        async:false,
        data: ({
            clef:'demandesAmi',
            idUser: $idUtilisateur
       }),

        success : function(retVal, statut){            
            $demandes = JSON.parse(retVal);
            document.getElementById("invitation_ami").innerHTML = "";
            $oui = "oui";
            $non = "non";
            if($demandes != null)
            {
                for(var i = 0; i < $demandes.length;i++)
                {
                    document.getElementById("invitation_ami").innerHTML += "<div id='demande_"+$demandes[i].id+"' class='ligneInvitAmi'><div class='labelDemandeAmi'>" + $demandes[i].prenom + " " + $demandes[i].nom + "</div><div class='divBoutonsChoix'><img id='boutonOui"+$demandes[i].id+"' class='iconeChoix' onclick='holdCliqueChoixBoutonDemandeAmi("+$demandes[i].id+",this)' src='../public/images/icones/reponse_oui.png' alt='Oui' /><img id='boutonNon"+$demandes[i].id+"' class='iconeChoix' onclick='holdCliqueChoixBoutonDemandeAmi("+$demandes[i].id+",this)' src='../public/images/icones/reponse_non.png' alt='Non' /></div></div><br/>";
                }
            }
            
        },
 
        error : function(retVal, statut, erreur){
 
        }
     });
}

function holdCliqueChoixBoutonDemandeAmi(idPersonneQuiDemande,elem)
{
    $idUtilisateur = getCookie("id");

    var idElem = elem.getAttribute("id");
    var choix = idElem.substring(6,9);

    $.ajax({
        cache : false,
        url : "../data/choixReponseDemandeAmi",
        type : "POST",
        async:false,
        data: ({
            choix:choix,
            idUser: $idUtilisateur,
            idPersonneQuiDemande:idPersonneQuiDemande
        }),
                    
        success : function(retVal, statut){            
            console.log(retVal);
            recupererAmisEtPromotion();
        },
                     
        error : function(retVal, statut, erreur){
                     
        }
    });
}

function afficherAmis()
{
    document.getElementById("amis").innerHTML = "";
    if(amis != null)
    {
        for(var i=0;i<amis.length;i++)
        {
            document.getElementById("amis").innerHTML += "<p id='ami_"+amis[i].id+"' class='labelConnaissance'>" + amis[i].prenom + " " + amis[i].nom + "</p>";
        }
    }
}

function afficherPromotion() 
{
    document.getElementById("promotion").innerHTML = "";
    if(promotion != null)
    {
        for(var i=0;i<promotion.length;i++)
        {
            document.getElementById("promotion").innerHTML += "<p id='promotion_"+promotion[i].id+"' class='labelConnaissance'>" + promotion[i].prenom + " " + promotion[i].nom + "</p>";
        }
    }
}

function openPersonTooltipAmi(event)
{
    $idUtilisateur = getCookie("id");

    var target = $(event.target);
    var elId = target.attr('id');

    var idPersonne = 0;
    var indexPersonne = 0;

    $cheminImageAjoutAmi = "";

    var nomPersonne = "";
    var prenomPersonne = "";
    var emailPersonne = "";
    var avatarPersonne = "";

    var posX = event.pageX-50;

    if(elId.substring(0,3) == "ami") // ami
    {
        idPersonne = elId.substring(4);
        for(var i = 0;i<amis.length;i++)
        {
            if(amis[i].id == idPersonne)
            {
                indexPersonne = i;
            }
        }

        nomPersonne = amis[indexPersonne].nom;
        prenomPersonne = amis[indexPersonne].prenom;
        emailPersonne = amis[indexPersonne].email;
        avatarPersonne = amis[indexPersonne].avatar;

        if(avatarPersonne == "")
        {
            avatarPersonne = "public/images/photo_profil/avatar-defaut.png";
            amis[indexPersonne].avatar = "public/images/photo_profil/avatar-defaut.png";
        }

        if($("#customTooltip").length)
        {
            $("#customTooltip").remove();
        }
        div = $("<div />");
        div.attr({id: 'customTooltip', class: 'personTooltip'});
        div.css({top: event.pageY, left: posX});
        div.html("<div id='conteneurTooltip'><div><div class='textLabelAmi'>"+prenomPersonne + " " + nomPersonne +"</div><div class='textLabelAmi'>"+emailPersonne+"</div><div id='divIconesGestion'><div id='divDejaAmi'><img id='iconeDejaAmi' class='iconeTooltip' title='Supprimer de votre liste d&apos;amis' src='../public/images/icones/friends-white.png' alt=''/></div><div id='divAfficherProfil'><img id='idImgAfficherProfil' class='iconeTooltip' title='Afficher le profil' src='../public/images/icones/profil-white.png' alt='Profil' /></div><div id='divEnvoyerMessage'><img id='iconeEnvoyerMessage' class='iconeTooltip' src'../public/images/icones/open-conversation-white.png' alt=''/></div></div></div><div><img class='avatarAmi' src='../"+avatarPersonne+"' alt=''/></div></div>");
        $("#boiteFenetre").append(div);

        $("#divDejaAmi").click(function() {
            if (confirm("Voulez vous supprimer "+prenomPersonne+ " " + nomPersonne +" de votre liste d'amis ?")) {
                $.ajax({
                    cache : false,
                    url : "../data/supprimerAmi",
                    type : "POST",
                    async:false,
                    data: ({
                        id: $idUtilisateur,
                        id_ami: idPersonne
                   }),
            
                    success : function(retVal, statut){

                    },
             
                    error : function(retVal, statut, erreur){
             
                    }
                 });
                 recupererAmisEtPromotion();
            } 
        });
        
    }
    else { // promotion
        idPersonne = elId.substring(10);
        for(var i = 0;i<promotion.length;i++)
        {
            if(promotion[i].id == idPersonne)
            {
                indexPersonne = i;
            }
        }

        nomPersonne = promotion[indexPersonne].nom;
        prenomPersonne = promotion[indexPersonne].prenom;
        emailPersonne = promotion[indexPersonne].email;
        avatarPersonne = promotion[indexPersonne].avatar;
        demandesAmi = promotion[indexPersonne].demandesAmi;

        if(avatarPersonne == "") // Si la personne n'a pas de photo de profil, on prend celle de base
        {
            avatarPersonne = "public/images/photo_profil/avatar-defaut.png";
            promotion[indexPersonne].avatar = "public/images/photo_profil/avatar-defaut.png";
        }
        
        if(demandesAmi != "" && demandesAmi != null)
        {
            $tabIdDemandesAmi = demandesAmi.split(';');
            if($tabIdDemandesAmi.includes($idUtilisateur))
            {
                $cheminImageAjoutAmi = "../public/images/icones/ok-white.png";
            }
            else {
                $cheminImageAjoutAmi = "../public/images/icones/ajouter-ami-white.png";
            }
        }
        else {
            $cheminImageAjoutAmi = "../public/images/icones/ajouter-ami-white.png";
        }

        if($("#customTooltip").length)
        {
            $("#customTooltip").remove();
        }
        div = $("<div />");
        div.attr({id: 'customTooltip', class: 'personTooltip'});
        div.css({top: event.pageY, left: posX});
        div.html("<div id='conteneurTooltip'><div><div class='textLabelAmi'>"+prenomPersonne + " " + nomPersonne +"</div><div class='textLabelAmi'>"+emailPersonne+"</div><div id='divIconesGestion'><div id='divAjoutAmi'><img id='iconeAjoutAmi' class='iconeTooltip' title='Envoyer une invitation d&apos;amis' src='"+$cheminImageAjoutAmi+"' alt=''/></div><div id='divAfficherProfil'><img id='idImgAfficherProfil' class='iconeTooltip' title='Afficher le profil' src='../public/images/icones/profil-white.png' alt='Profil' /></div><div id='divEnvoyerMessage'><img id='iconeEnvoyerMessage' class='iconeTooltip' src'../public/images/icones/open-conversation-white.png' alt=''/></div></div></div><div><img class='avatarAmi' src='../"+avatarPersonne+"' alt=''/></div></div>");
        $("#boiteFenetre").append(div);

        $("#divAjoutAmi").click(function() {
            if (confirm("Demander "+prenomPersonne+ " " + nomPersonne +" en ami ?")) {
                $.ajax({
                    cache : false,
                    url : "../data/envoyerDemandeAmi",
                    type : "POST",
                    async:false,
                    data: ({
                        id: $idUtilisateur,
                        id_ami_a_ajouter: idPersonne
                   }),
            
                    success : function(retVal, statut){
                        console.log(retVal);
                    },
             
                    error : function(retVal, statut, erreur){
             
                    }
                 });
                 recupererAmisEtPromotion();
            } 
        });
    }


    // Gestion des clicks sur amis et ajouter amis

    // voir profil
    $("#divAfficherProfil").click(function() {
        setCookie("affichage_profil_id" ,idPersonne);
        window.location = "../view/profil.php";
    });
        
    $("#customTooltip").mouseleave(supPopUp);

    function supPopUp()
    {
        $("#customTooltip").remove();
    }
}

function closePersonTooltipAmi()
{
    if(!$('#customTooltip').is(":hover"))
    {
        $("#customTooltip").remove();
    }
}

function keyEnterListenerOnMessageInput()
{
    var champsTexte = document.getElementById("barreEnvoiMessage");
    champsTexte.onkeypress = function(e) {
        e = e || window.event;
        var codeCaractere = (typeof e.which == "number") ? e.which : e.codeCaractere;
        if (codeCaractere == 13) {
            $("#barreEnvoiMessage").val("");


        }
    };
}

function containerInit()
{
    window.onload=function(){  
        $('#boiteFenetre').css('height', $(window).height()-150 + 'px');
    }
    window.onresize = resizeContainers();
}

function resizeContainers()
{
        $(window).resize(function() {
            var sH = $(window).height();
            $('#boiteFenetre').css('height', sH-150 + 'px');
        });        
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue) {
	document.cookie = cname + "=" + cvalue + ";path=/";
}