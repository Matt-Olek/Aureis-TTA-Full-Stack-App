import React, { useEffect, useState } from "react";
import Typewriter from "../utils/Typewriter";
import HomeModules from "./HomeModules";

const Home: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [currentChar, setCurrentChar] = useState<number>(0);

  const speeds: number[] = [25, 35, 30, 40, 20];

  useEffect(() => {
    const lines1 = [
      "La plateforme de gestion",
      "qui matche les alternants",
      "et les entreprises en un clic !",
    ];
    const lines2 = [
      "La plateforme de gestion",
      "qui connecte les alternants",
      "et les entreprises en un clic !",
    ];
    const randomLines = Math.random() < 0.5 ? lines1 : lines2;
    setLines(randomLines);

    // Start typing effect
    typeWriter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeWriter = () => {
    if (currentLine < lines.length) {
      const lineElement = document.getElementById(
        `line${currentLine + 1}`
      ) as HTMLParagraphElement;
      const speed = speeds[currentLine];

      if (currentChar < lines[currentLine].length) {
        lineElement.innerHTML += lines[currentLine].charAt(currentChar);
        setCurrentChar(currentChar + 1);
        setTimeout(typeWriter, speed);
      } else {
        lineElement.innerHTML += "<br>";
        setCurrentLine(currentLine + 1);
        setCurrentChar(0);
        setTimeout(typeWriter, speed);
      }
    }
  };

  return (
    <>
      <section
        id="home"
        className="w-full h-screen flex items-center justify-center"
      >
        <div className="lg:w-1/2 bg-stone-900 items-center justify-center lg:rounded-3xl w-full h-full p-4 lg:h-auto lg:p-8">
          <div
            className="anton mt-4 p-5"
            style={{
              lineHeight: 1.2,
              width: "100%",
              fontSize: "min(50px,max(20px, 3vw))",
            }}
          >
            <p id="line1" className="m-0 text-pink-300">
              <Typewriter text="La plateforme de gestion" delay={50} />
            </p>
            <p id="line2" className="m-0">
              <Typewriter text="qui connecte les alternants" delay={100} />
            </p>
            <p id="line3" className="m-0 text-green-300">
              <Typewriter text="et les entreprises en un clic !" delay={150} />
            </p>
          </div>
          <HomeModules />
        </div>
      </section>

      <section
        id="info_entreprise"
        className="w-full flex items-center justify-center"
      >
        <div className="w-full lg:w-10/12 bg-stone-900 lg:rounded-3xl flex justify-center">
          <div className="container mx-auto">
            <div className="flex flex-col items-center">
              <div className="flex justify-center w-full">
                <img
                  src="/media/images/bateau.svg"
                  className="h-30vh mt-24"
                  alt="Bateau"
                />
              </div>
              <div className="text-center mt-8">
                <h1 className="text-7xl lily text-white">Entreprises,</h1>
                <h1 className="text-5xl anton text-green-300">
                  vous recherchez vos
                </h1>
                <h1 className="text-5xl anton text-green-300">
                  futur talents ?
                </h1>
              </div>
              <div className="w-1/2 mx-auto mt-8">
                <p className="text-center manrope text-white">
                  Attachez vos ceintures, car notre algorithme de matching
                  ultra-moderne vous connecte avec des alternants motivés et
                  prêts à tout déchirer dans le monde professionnel.
                </p>
              </div>
              <div className="flex justify-center mt-8">
                <a
                  href="/signup?type=company"
                  className="bg-pink-300 text-stone-900 font-bold py-2 px-4 rounded-3xl manrope text-center hover:text-stone-900 hover:bg-white transition duration-300"
                >
                  Recruter un alternant
                </a>
              </div>
              <div className="text-center text-white mt-12">
                <p className="text-3xl manrope">1100</p>
                <p className="text-xl manrope">Alternants</p>
                <p className="text-xl manrope">inscrits</p>
              </div>
              <div className="flex flex-wrap justify-center mt-12">
                <div className="p-24 pt-0 w-full md:w-1/3">
                  <img
                    src="/media/images/icon-interface.svg"
                    className="h-16 mx-auto"
                    alt="Interface"
                  />
                  <h1 className="text-4xl anton text-white mt-2 text-center">
                    Une interface
                  </h1>
                  <h1 className="text-4xl lily text-white text-center">
                    intuitive
                  </h1>
                  <p className="manrope text-white text-center mt-3">
                    Plus besoin d’un mode d’emploi pour trouver l’alternant
                    idéal. Notre site est aussi simple à utiliser qu’un émoi
                    sourire.
                  </p>
                </div>
                <div className="p-24 pt-0 w-full md:w-1/3">
                  <img
                    src="/media/images/icon-matching.svg"
                    className="h-16 mx-auto"
                    alt="Matching"
                  />
                  <h1 className="text-4xl anton text-white mt-2 text-center">
                    Matching
                  </h1>
                  <h1 className="text-4xl lily text-white text-center">
                    de talents
                  </h1>
                  <p className="manrope text-white text-center mt-3">
                    Le candidat idéal pour votre offre est peut-être déjà dans
                    votre vivier de talents : notre intelligence artificielle
                    l’identifie pour vous.
                  </p>
                </div>
                <div className="p-24 pt-0 w-full md:w-1/3">
                  <img
                    src="/media/images/icon-loupe.svg"
                    className="h-16 mx-auto"
                    alt="Analyse"
                  />
                  <h1 className="text-4xl anton text-white mt-2 text-center">
                    Une analyse
                  </h1>
                  <h1 className="text-4xl lily text-white text-center">
                    poussée
                  </h1>
                  <p className="manrope text-white text-center mt-3">
                    Notre algorithme ne s’arrête pas à la lecture des données
                    pour faire matcher les candidats de votre vivier et votre
                    offre d’emploi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="info_alternant" className="mt-12 w-full">
        <div className="flex justify-center">
          <div className="w-full lg:w-10/12 bg-green-300 lg:rounded-3xl flex justify-center">
            <div className="container mx-auto">
              <div className="flex flex-col items-center">
                <div className="flex justify-center w-full">
                  <img
                    src="/media/images/lemon.svg"
                    className="h-30vh mt-24"
                    alt="Lemon"
                  />
                </div>
                <div className="text-center mt-8">
                  <h1 className="text-6xl lily text-black">
                    Pourquoi <span className="anton">nous choisir ?</span>
                  </h1>
                </div>
                <div className="w-1/2 mx-auto mt-8">
                  <p className="text-center manrope text-black">
                    Alternants, on vous comprend ! Ici, c’est la célébration de
                    la recherche d’alternance sans prise de tête. Fini les
                    casse-têtes administratifs, chez nous, c’est easy peasy
                    lemon squeezy.
                  </p>
                </div>
                <div className="flex justify-center mt-8">
                  <a
                    href="/signup?type=applicant"
                    className="bg-black text-white py-3 px-6 rounded-3xl shadow-lg w-80 text-center hover:text-black hover:bg-white manrope transition duration-300"
                  >
                    Trouver mon alternance
                  </a>
                </div>
                <div className="text-center text-black mt-12">
                  <p className="text-3xl manrope">100</p>
                  <p className="text-xl manrope">Entreprises</p>
                  <p className="text-xl manrope">inscrites</p>
                </div>
                <div className="w-full bg-gray-200 rounded-3xl mt-8 mb-12">
                  <div className="flex flex-wrap justify-center p-24">
                    <div className="p-10 w-full md:w-1/3 text-center">
                      <img
                        src="/media/images/icon-interface.svg"
                        className="h-16 mx-auto"
                        alt="Interface"
                      />
                      <h1 className="text-4xl anton text-black mt-2">
                        Une interface
                      </h1>
                      <h1 className="text-4xl lily text-black">intuitive</h1>
                      <p className="manrope text-black">
                        Plus besoin d’un mode d’emploi pour trouver l’alternant
                        idéal. Notre site est aussi simple à utiliser qu’un émoi
                        sourire.
                      </p>
                    </div>
                    <div className="p-10 w-full md:w-1/3 text-center">
                      <img
                        src="/media/images/icon-matching.svg"
                        className="h-16 mx-auto"
                        alt="Matching"
                      />
                      <h1 className="text-4xl anton text-black mt-2">
                        Matching
                      </h1>
                      <h1 className="text-4xl lily text-black">ultra-rapide</h1>
                      <p className="manrope text-black">
                        Toutes les heures, l’algorithme de matching de TrouveTon
                        Alternance te propose des offres qui te correspondent
                        vraiment.
                      </p>
                    </div>
                    <div className="p-10 w-full md:w-1/3 text-center">
                      <img
                        src="/media/images/icon-resume.svg"
                        className="h-16 mx-auto"
                        alt="Portfolio"
                      />
                      <h1 className="text-4xl anton text-black mt-2">
                        Portfolio
                      </h1>
                      <h1 className="text-4xl lily text-black">automatique</h1>
                      <p className="manrope text-black">
                        Crée ton compte et renseigne tes informations en
                        quelques clics. Uploade ton CV et notre analyseur fera
                        le reste.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
