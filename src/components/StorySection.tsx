import { Heart, Award, Users } from "lucide-react";

export const StorySection = () => {
  return (
    <section className="bg-gradient-warm p-6 text-white">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-xl font-bold">Our Story</h2>
        
        <div className="space-y-3 text-sm leading-relaxed opacity-95">
          <p>
            <strong>Sonna Sublok</strong>, lovingly known as <strong>'Sonna Aunty'</strong>, 
            has been baking since she was young.
          </p>
          <p>
            What started with a friend's request turned into years of making birthdays, 
            anniversaries, and special occasions sweeter.
          </p>
          <p>
            This café is her home, and we invite you to enjoy soul-filling food 
            and her heartfelt cakes.
          </p>
          <p className="font-semibold text-lg">
            You are our family. ❤️
          </p>
          <p className="text-right italic">
            Love,<br />
            Team Sonna's
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <Award className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs font-medium">100% Veg</div>
          </div>
          <div className="text-center">
            <Heart className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs font-medium">Made with Love</div>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xs font-medium">Family Recipes</div>
          </div>
        </div>
      </div>
    </section>
  );
};