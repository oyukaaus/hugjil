import React from "react";
import Link from "next/link";
import Animate from "../components/animation/animate";

const Plan = () => {
  return (
    <div className="text-white bg-gray-900 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mt-20 mb-20 ">
          <h2 className="text-3xl font-bold text-white">Багцын мэдээлэл</h2>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          {/* Package 1 */}
          <Animate className="animate__animated animate__fadeInUp" delay="100ms">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg justify-center flex flex-col">
              <div className="text-yellow-400 text-sm font-bold mb-2 h-4"></div>
              <h4 className="text-xl font-semibold mb-1">Багц-1</h4>
              <h2 className="text-3xl font-bold text-white mb-1">200,000₮</h2>
              <span className="text-sm text-gray-500 mb-4 block">Сард төлөх</span>
              <ul className="space-y-2 text-sm mb-6 h-[270px]">
                <li>Access to GPT-4o mini and reasoning</li>
                <li>✔️ Standard voice mode</li>
                <li>✔️ Real-time data from the web with search</li>
                <li>✔️ Limited access to GPT-4o and o4-mini</li>
                <li>✔️ Limited access to file uploads, advanced data analysis, and image generation</li>
                <li>✔️ Use custom GPTs</li>
              </ul>
              <Link href="/contact-us" className="btn btn-gradient text-white bg-gradient-to-r from-blue-500 to-indigo-600 py-2 px-4 rounded-md inline-block text-center">
                Дэлгэрэнгүй
              </Link>
            </div>
          </Animate>

          {/* Package 2 */}
          <Animate className="animate__animated animate__fadeInUp" delay="200ms">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg border border-yellow-400  justify-center flex flex-col">
              <div className="text-yellow-400 text-sm font-bold mb-2">🔥 Best Deal</div>
              <h4 className="text-xl font-semibold mb-1">Багц-2</h4>
              <h2 className="text-3xl font-bold text-white mb-1">600,000₮</h2>
              <span className="text-sm text-gray-500 mb-4 block">Сард төлөх</span>
              <ul className="space-y-2 text-sm mb-6  h-[270px]">
                <li>✔️ Everything in Free</li>
                <li>✔️ Extended limits on messaging, file uploads, advanced data analysis, and image generation</li>
                <li>✔️ Standard and advanced voice mode</li>
                <li>✔️ Access to deep research, multiple reasoning models (o4-mini, o4-mini-high, and o3), and a research preview of GPT-4.5</li>
                <li>✔️ Create and use tasks, projects, and custom GPTs</li>
                <li>✔️ Limited access to Sora video generation</li>
                <li>✔️ Opportunities to test new features</li>
              </ul>
              <Link href="/contact-us" className="btn bg-yellow-500 text-black py-2 px-4 rounded-md inline-block text-center">
                Дэлгэрэнгүй
              </Link>
            </div>
          </Animate>

          {/* Package 3 */}
          <Animate className="animate__animated animate__fadeInUp" delay="300ms">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-lg justify-center flex flex-col">
              <div className="text-yellow-400 text-sm font-bold mb-2 h-4"></div>
              <h4 className="text-xl font-semibold mb-1">Багц-3</h4>
              <h2 className="text-3xl font-bold text-white mb-1">2,000,000₮</h2>
              <span className="text-sm text-gray-500 mb-4 block">Сард төлөх</span>
              <ul className="space-y-2 text-sm mb-6 h-[270px]">
                <li>✔️ Everything in Plus</li>
                <li>✔️ Unlimited access to all reasoning models and GPT-4o</li>
                <li>✔️ Unlimited access to advanced voice</li>
                <li>✔️ Extended access to deep research, which conducts multi-step online research for complex tasks</li>
                <li>✔️ Access to research previews of GPT-4.5 and Operator</li>
                <li>✔️ Access to o1 pro mode, which uses more compute for the best answers to the hardest questions</li>
                <li>✔️ Extended access to Sora video generation</li>
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

export default Plan;
