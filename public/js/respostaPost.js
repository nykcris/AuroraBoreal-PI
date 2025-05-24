document.addEventListener("DOMContentLoaded", function(){
    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", gravarResposta);
})

function gravarResposta() {
    let resposta = document.getElementById("resposta");
    let id_atividade = document.getElementById("id_atividade");
    let anexo_resposta = document.getElementById("anexo_resposta");
    console.log("Hey");
    console.log(id_atividade);
    console.log(anexo_resposta.files);

    if(
        resposta.value != "" &&
        id_atividade.value != ""
    ){
        var form = new FormData();
        form.set("resposta", resposta.value);
        form.set("id_atividade", id_atividade.value);
        if(anexo_resposta.files.length > 0){
            form.set("anexo_resposta", anexo_resposta.files[0]);
        }


        fetch("/system/alunos/resposta", {
            method: "POST",
            body: form
        })
        .then(res => {
            if(res.status == 200){
                alert("Resposta enviada com sucesso!");
                window.location.href = "/system/alunos";
            }else{
                alert("Erro ao enviar resposta!");
            }
        })
        
    }else{
        alert("Preencha todos os campos!");
    }
}