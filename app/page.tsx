import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
export default function Home() {
	return (
		<main className="min-h-dvh bg-white">
			<div className="">
				<NavBar />
				<Hero />
				<Features />
				<Footer />
			</div>
		</main>
	);
}
