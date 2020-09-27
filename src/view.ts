export class View {

	public render(viewContent:string, viewTitle:string='EdgePetitions') {
		return `
			<!doctype html>
			<html>
				<head>
					<title>${viewTitle}</title>
					<meta name="robots" content="noindex,nofollow" />
					<style type="text/css">
						* {box-sizing: border-box;}
						body {margin: 0; padding: 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 19px; font-weight: 400;}
						.wrapper {width: 90%; max-width: 650px; margin: 0 auto;}
						header {padding: 15px; background: #080; color: #fff;}
						header a {color: #fff;}
						header p {margin: 15px 0 0;}
						section {margin: 30px 0;}
						section h2 {margin: 0; font-size: 24px; font-weight: 700;}
						a {color: #005ea5; text-decoration: none;}
						hr {margin: 30px 0; height: 0; border: 0; border-top: 1px solid #ddd;}
						form {margin: 30px 0; padding: 30px; background: #dee0e2;}
						form label {display: block; margin-bottom: 15px;}
						form input[type="email"] {display: block; width: 100%; padding: 15px; background: #fff; border: 2px solid #000;}
						ul {list-style: none; padding: 0;}
						ul li {margin: 0; padding: 0 30px 0 0;}
						ul li p {margin-top: 10px; color: rgba(0,0,0,.75);}
						.info {padding: 30px; background: #fff; border: 2px dashed #dee0e2;}
						.info p:last-of-type {margin-bottom: 0;}
						figure {margin: 0;font-size: 27px;}
						figure strong {font-size: 48px;}
						.btn {display: inline-block; padding: 15px; background: #080; color: #fff; border: 0; box-shadow: 0 2px 0 #003c00;}
					</style>
				</head>
				<body>
					<header>
						<div class="wrapper">
							<strong><a href="/">EdgePetitions</a></strong>
							<p>A petitions app on the Edge.</p>
						</div>
					</header>
					<section>
						<div class="wrapper">
							${viewContent}
							<hr />
							<div class="info">
								<h2>What is this?</h2>
								<p>EdgePetitions is a proof of concept petitions app served "on the Edge" via Cloudflare Workers. Feel free to try signing a petition - 
								your email is only stored for 24 hours, and is saved in a hashed format anyway (so nobody can see it).</p>
								<p>You can read the post about it <a href="https://simon-thompson.me/100-uptime-democracy-replicating-the-hoc-petition-site-on-the-edge/" target="_blank">here</a>.</p>
							</div>
						</div>
					</section>
				</body>
			</html>
		`
	}
}
