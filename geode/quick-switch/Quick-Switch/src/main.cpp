#include <Geode/Geode.hpp>

#include <Geode/modify/PauseLayer.hpp>

using namespace geode::prelude;

class $modify(MyPauseLayer, PauseLayer) {
    void customSetup() {
        PauseLayer::customSetup();

        auto btnSpr = ButtonSprite::create("My Button");
        auto btn = CCMenuItemSpriteExtra::create(
            btnSpr, this, menu_selector(MyPauseLayer::onMyButton)
        );
        btn->setPosition(0, 50);
        
        auto menu = this->getChildByID("bottom-menu");
        if (menu) {
            menu->addChild(btn);
        }
    }

    void onMyButton(CCObject* sender) {
        FLAlertLayer::create(nullptr, "Hello!", "Button pressed!", "OK", nullptr, 200.f)->show();
    }
};
