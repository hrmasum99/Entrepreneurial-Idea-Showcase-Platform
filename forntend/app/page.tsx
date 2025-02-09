import Image from "next/image";
import TitleBar from "./components/titlebar";
import FavIcon from "./components/favicon";
import Header from "./components/header";
import Footer from "./components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div>
    <TitleBar title="Home"/>
    <FavIcon href="/fav99.svg"/>
    <Header/>
      <section>
        <table>
          <tbody>
            <tr>
              <td>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis dolores sequi iste ex? Corrupti rem aut culpa odit quae? Fuga voluptatem atque nobis voluptates debitis esse quibusdam quae reprehenderit itaque magni odio necessitatibus tempora laudantium, libero nisi velit. Ipsum alias, ab impedit qui deleniti numquam animi velit dolores debitis neque eos ipsam, dolorem quidem similique veniam rem et expedita! Sequi est facilis tenetur doloremque doloribus eum blanditiis, maxime modi? Nobis atque a explicabo minima ipsa non facere quisquam tenetur harum! Nesciunt cupiditate similique quas sint odio minus, eos vitae quod doloremque incidunt temporibus voluptatem nobis cumque, ipsum, reiciendis saepe. Mollitia possimus dolorem reprehenderit id dolores quae porro quisquam aut quasi architecto, corrupti debitis vel omnis dolor laborum iure sed ipsum, officia culpa. Reprehenderit nemo cupiditate corporis, quod, eum soluta facilis illo explicabo fuga eaque maiores. Cupiditate voluptatibus illo quasi ipsum laborum magni quam excepturi, porro quisquam tempora consequuntur, ut numquam.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <table>
          <tbody>
            <tr>
              <td>
                <Link href="box/1">Box 1</Link>
              </td>
              <td>
                <Link href="box/2">Box 2</Link>
              </td>
              <td>
                <Link href="box/3">Box 3</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <Footer/>
    </div>
  );
}
    