import React from "react";
import Link from "next/link";
import Animate from "../components/animation/animate";

const MyPlanPage = () => {
  return (
    <div className="text-white bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Манай үйлчилгээний багцууд</h2>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          {/* Package 1 */}
          <Animate className="animate__animated animate__fadeInUp" delay="100ms">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg">
              <h4 className="text-xl font-semibold mb-1">Багц-1</h4>
              <p className="text-gray-400 mb-4">5 хүртэлх ажилтан</p>
              <h2 className="text-3xl font-bold text-white mb-1">200,000₮</h2>
              <span className="text-sm text-gray-500 mb-4 block">Сард төлөх</span>
              <ul className="space-y-2 text-sm mb-6">
                <li>✔️ Санхүүгийн тайлан</li>
                <li>✔️ Татварын тайлан</li>
                <li>✔️ НДШ тайлан /5 хүртэл ажилтан/</li>
                <li>✔️ Аппликейшн ашиглах 1 эрх</li>
              </ul>
              <Link href="/contact-us" className="btn btn-gradient text-white bg-gradient-to-r from-blue-500 to-indigo-600 py-2 px-4 rounded-md inline-block text-center">
                Дэлгэрэнгүй
              </Link>
            </div>
          </Animate>

          {/* Package 2 */}
          <Animate className="animate__animated animate__fadeInUp" delay="200ms">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg border border-yellow-400">
              <div className="text-yellow-400 text-sm font-bold mb-2">🔥 Best Deal</div>
              <h4 className="text-xl font-semibold mb-1">Багц-2</h4>
              <p className="text-gray-400 mb-4">20 хүртэл ажилтан</p>
              <h2 className="text-3xl font-bold text-white mb-1">600,000₮</h2>
              <span className="text-sm text-gray-500 mb-4 block">Сард төлөх</span>
              <ul className="space-y-2 text-sm mb-6">
                <li>✔️ Санхүүгийн тайлан</li>
                <li>✔️ Татварын тайлан</li>
                <li>✔️ НДШ тайлан /20 хүртэл ажилтан/</li>
                <li>✔️ Аппликейшн ашиглах 3 эрх</li>
              </ul>
              <Link href="/contact-us" className="btn bg-yellow-500 text-black py-2 px-4 rounded-md inline-block text-center">
                Дэлгэрэнгүй
              </Link>
            </div>
          </Animate>

          {/* Package 3 */}
          <Animate className="animate__animated animate__fadeInUp" delay="300ms">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg">
              <h4 className="text-xl font-semibold mb-1">Багц-3</h4>
              <p className="text-gray-400 mb-4">50 хүртэл ажилтан</p>
              <h2 className="text-3xl font-bold text-white mb-1">2,000,000₮</h2>
              <span className="text-sm text-gray-500 mb-4 block">Сард төлөх</span>
              <ul className="space-y-2 text-sm mb-6">
                <li>✔️ Санхүүгийн тайлан</li>
                <li>✔️ Татварын тайлан</li>
                <li>✔️ НДШ тайлан /50 хүртэл ажилтан/</li>
                <li>✔️ Аппликейшн ашиглах 5 эрх</li>
              </ul>
              <Link href="/contact-us" className="btn bg-white text-black py-2 px-4 rounded-md inline-block text-center">
                Дэлгэрэнгүй
              </Link>
            </div>
          </Animate>
        </div>
      </div>
    </div>
  );
};

export default MyPlanPage;
