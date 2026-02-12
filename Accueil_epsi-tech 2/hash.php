<script>
    document.querySelector("form").addEventListener("submit", function (e) {
        let pwd = document.querySelector("#motdepasse").value;
        let conf = document.querySelector("#confirme").value;
        if (pwd !== conf) {
            alert("Les mots de passe ne correspondent pas !");
            e.preventDefault();
        }
    });
</script>